package com.ecommerce.controller;

import com.ecommerce.decorator.ProductView;
import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
// @CrossOrigin(origins = "*")
public class ProductController {

  private final ProductService service;

  public ProductController(ProductService service) {
    this.service = service;
  }

  /* ---------- PRODUCT GRID ---------- */
  @GetMapping("/products")
  public List<ProductView> products() {
    return service.allProductViews();
  }

  /* ---------- CATEGORIES ---------- */
  @GetMapping("/products/categories")
  public List<String> getCategories() {
    return service.allProducts()
                  .stream()
                  .map(Product::getCategory)
                  .distinct()
                  .sorted()
                  .collect(Collectors.toList());
  }

  /* ---------- REALTIME STOCK UPDATE ---------- */
  @PostMapping("/products/{id}/stock")
  public ProductView updateStock(
      @PathVariable Long id,
      @RequestBody int newStock
  ) {
    return service.updateStock(id, newStock);
  }
}