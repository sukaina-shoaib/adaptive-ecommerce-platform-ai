package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.model.Order;
import com.ecommerce.service.ProductService;
import com.ecommerce.repository.OrderRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.time.Instant;

@RestController
@RequestMapping("/api/admin")
/* * Note: @CrossOrigin is handled globally in com.ecommerce.config.WebConfig
 */
public class AdminController {

    private final ProductService productService;
    private final OrderRepository orderRepository;
    
    // This matches the volume mapping in your docker-compose.yml
    private final String UPLOAD_DIR = "/app/uploads/";

    public AdminController(ProductService productService, OrderRepository orderRepository) {
        this.productService = productService;
        this.orderRepository = orderRepository;
    }

    /**
     * Fetch all customer orders for the Admin Dashboard
     */
    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /**
     * Add a new product with an image file
     * Consumes multipart/form-data to handle both JSON and Binary files
     */
    @PostMapping(value = "/products", consumes = {"multipart/form-data"})
    public ResponseEntity<?> addProduct(
            @RequestPart("product") String productJson,
            @RequestPart("file") MultipartFile file) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.findAndRegisterModules();
            
            Product product = objectMapper.readValue(productJson, Product.class);

            // Handle file storage
            Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            
            String fileName = System.currentTimeMillis() + extension;
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            product.setImageUrl(fileName);
            product.setUpdatedAt(Instant.now());
            
            // Persist to Database
            Product savedProduct = productService.saveProduct(product);
            return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload Failed: " + e.getMessage());
        }
    }

    /**
     * UPDATE an existing product
     * This handles the Edit logic from the Admin Portal table
     */
    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product details) {
        try {
            // Find existing product or throw error
            Product existingProduct = productService.allProducts()
                    .stream()
                    .filter(p -> p.getId().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

            // Update fields
            existingProduct.setName(details.getName());
            existingProduct.setBasePrice(details.getBasePrice());
            
            /* * BUSINESS RULE: When admin edits, current price remains same as base price.
             * The Observer (PriceManager) will handle dynamic discounting later.
             */
            existingProduct.setCurrentPrice(details.getBasePrice()); 
            
            existingProduct.setStock(details.getStock());
            existingProduct.setCategory(details.getCategory());
            existingProduct.setUpdatedAt(Instant.now());

            Product updated = productService.saveProduct(existingProduct);
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Update Failed: " + e.getMessage());
        }
    }

    /**
     * Remove a product from the marketplace
     */
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}