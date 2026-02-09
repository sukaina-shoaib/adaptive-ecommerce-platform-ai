package com.ecommerce.controller;

import com.ecommerce.decorator.ProductView;
import com.ecommerce.service.ProductService;
import com.ecommerce.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller responsible for AI-driven product recommendations.
 * This satisfies the Strategy Pattern requirements by providing visibility 
 * into the active recommendation algorithm.
 */
@RestController
@RequestMapping("/api/recommendations")
// @CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {

    private final ProductService productService;
    private final UserService userService;

    public RecommendationController(ProductService productService,
                                    UserService userService) {
        this.productService = productService;
        this.userService = userService;
    }

    /**
     * AI Personalized Recommendations
     * GET /api/recommendations/{userId}
     * * Orchestrates the Strategy pattern via ProductService to return 
     * decorated ProductViews tailored to the user.
     */
    @GetMapping("/{userId}")
    public List<ProductView> getRecommendations(@PathVariable Long userId) {
        // 1. Validate user exists (throws exception if not found)
        userService.getById(userId);

        // 2. Delegate to the Strategy Engine inside ProductService
        // This returns ProductView objects (decorated with badges and AI tips)
        return productService.recommend(userId);
    }

    /**
     * Strategy Visibility / Reflection Info
     * GET /api/recommendations/strategy
     * * Returns the name of the algorithm currently being used by the RecommendationEngine.
     */
    @GetMapping("/strategy")
    public String currentStrategy() {
        return productService.currentStrategy();
    }
}