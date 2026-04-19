package com.example.cart.controller;

import com.example.cart.model.Product;
import com.example.cart.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;

    /**
     * GET /api/products — all available products
     * Query params: category, subCategory, classLevel, search
     */
    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subCategory,
            @RequestParam(required = false) String classLevel,
            @RequestParam(required = false) String search) {

        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(productRepository.findByNameContainingIgnoreCase(search));
        }

        if (category != null && subCategory != null && classLevel != null) {
            return ResponseEntity.ok(
                    productRepository.findByCategoryAndSubCategoryAndClassLevel(category, subCategory, classLevel));
        }
        if (category != null && subCategory != null) {
            return ResponseEntity.ok(
                    productRepository.findByCategoryAndSubCategory(category, subCategory));
        }
        if (category != null && classLevel != null) {
            return ResponseEntity.ok(
                    productRepository.findByCategoryAndClassLevel(category, classLevel));
        }
        if (category != null) {
            return ResponseEntity.ok(productRepository.findByCategory(category));
        }
        if (classLevel != null) {
            return ResponseEntity.ok(productRepository.findByClassLevel(classLevel));
        }

        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Check inventory for a single product (called on selection/deselection)
     */
    @GetMapping("/{id}/inventory")
    public ResponseEntity<?> getInventory(@PathVariable String id) {
        return productRepository.findById(id)
                .<ResponseEntity<?>>map(p -> ResponseEntity.ok(Map.of(
                        "productId", p.getId(),
                        "stockQuantity", p.getStockQuantity(),
                        "available", p.isAvailable())))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Featured endpoint: highlights for landing page (top 4 from each main category)
     */
    @GetMapping("/featured")
    public ResponseEntity<Map<String, List<Product>>> getFeatured() {
        List<Product> books = productRepository.findByCategory("BOOKS").stream().limit(4).toList();
        List<Product> stationery = productRepository.findByCategory("STATIONERY").stream().limit(4).toList();
        List<Product> toys = productRepository.findByCategory("TOYS").stream().limit(4).toList();

        return ResponseEntity.ok(Map.of(
                "books", books,
                "stationery", stationery,
                "toys", toys
        ));
    }
}
