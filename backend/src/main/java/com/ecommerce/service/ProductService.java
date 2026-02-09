package com.ecommerce.service;

import com.ecommerce.decorator.*;
import com.ecommerce.model.Product;
import com.ecommerce.observer.InventoryManager;
import com.ecommerce.observer.PriceManager;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.strategy.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * ProductService
 * Core logic for managing the product catalog and design patterns.
 */
@Service
public class ProductService {

    private final ProductRepository productRepo;
    private final SimpMessagingTemplate ws;

    // Behavioral Pattern: Observer (Manages inventory-driven events)
    private final InventoryManager inventoryManager = new InventoryManager();

    // Behavioral Pattern: Strategy (Swappable Recommendation Algorithms)
    private final RecommendationEngine recEngine =
            new RecommendationEngine(new CollaborativeFiltering());

    // Structural Pattern: Decorator (Enhances UI data with badges/AI tips)
    private final List<ProductDecorator> decorators = List.of(
            new LowStockBadgeDecorator(),
            new DiscountBadgeDecorator(),
            new AIGeneratedDescriptionDecorator()
    );

    public ProductService(ProductRepository productRepo, SimpMessagingTemplate ws) {
        this.productRepo = productRepo;
        this.ws = ws;
        // Registering the PriceManager to watch for inventory changes
        this.inventoryManager.attach(new PriceManager());
    }

    /* --------------------------------------------------
       PRODUCT LISTING & RECOMMENDATIONS
    -------------------------------------------------- */

    public List<Product> allProducts() {
        return productRepo.findAll();
    }

    public List<ProductView> allProductViews() {
        return productRepo.findAll().stream().map(this::decorate).collect(Collectors.toList());
    }

    public List<ProductView> recommend(Long userId) {
        List<Product> pool = productRepo.findAll();
        return recEngine.getRecommendations(userId, pool)
                .stream().map(this::decorate).collect(Collectors.toList());
    }

    public String currentStrategy() {
        return recEngine.currentStrategyName();
    }

    /* --------------------------------------------------
       ADMIN PORTAL LOGIC
    -------------------------------------------------- */

    @Transactional
    public Product saveProduct(Product product) {
        // Initial check: if stock is high, apply discount before first save
        inventoryManager.notifyAllObservers(product);
        Product saved = productRepo.save(product);
        ws.convertAndSend("/topic/inventory", decorate(saved));
        return saved;
    }

    @Transactional
    public void applyManualDiscount(Long id, Double percentage) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        BigDecimal discountFactor = BigDecimal.valueOf(percentage / 100.0);
        BigDecimal discountAmount = p.getBasePrice().multiply(discountFactor);
        
        p.setCurrentPrice(p.getBasePrice().subtract(discountAmount));
        
        // Save the manual update
        Product saved = productRepo.save(p);
        ws.convertAndSend("/topic/inventory", decorate(saved));
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepo.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepo.deleteById(id);
        ws.convertAndSend("/topic/inventory", "DELETED:" + id);
    }

    /* --------------------------------------------------
       STOCK MANAGEMENT & OBSERVER TRIGGER
    -------------------------------------------------- */

    

    @Transactional
    public void reduceStock(Long productId, int qty) {
        Product p = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int updated = p.getStock() - qty;
        if (updated < 0) throw new RuntimeException("Insufficient stock");

        p.setStock(updated);
        
        // 1. Notify Observers: PriceManager will check stock and update p.currentPrice
        inventoryManager.notifyAllObservers(p);
        
        // 2. Save the modified product (including potential price change)
        Product saved = productRepo.save(p);
        
        // 3. Broadcast updated view
        ws.convertAndSend("/topic/inventory", decorate(saved));
    }

    @Transactional
    public ProductView updateStock(Long productId, int newStock) {
        Product p = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        p.setStock(newStock);
        
        // 1. Trigger the PriceManager logic
        inventoryManager.notifyAllObservers(p);
        
        // 2. PERSIST the changes made by the observer to the DB
        Product saved = productRepo.save(p);
        
        // 3. Create view and broadcast
        ProductView view = decorate(saved);
        ws.convertAndSend("/topic/inventory", view);
        return view;
    }

    /* --------------------------------------------------
       DECORATOR PIPELINE
    -------------------------------------------------- */

    

    private ProductView decorate(Product p) {
        ProductView v = new ProductView();
        v.id = p.getId();
        v.name = p.getName();
        v.description = p.getDescription();
        v.price = p.getCurrentPrice();
        v.basePrice = p.getBasePrice();
        v.stock = p.getStock();
        v.image_url = p.getImageUrl();
        v.category = p.getCategory();

        // Apply decorators (Low Stock, Mega Deal, AI Tips)
        for (ProductDecorator d : decorators) {
            v = d.apply(v);
        }
        return v;
    }
}