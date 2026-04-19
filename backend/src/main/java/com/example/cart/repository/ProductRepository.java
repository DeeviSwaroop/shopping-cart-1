package com.example.cart.repository;

import com.example.cart.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategory(String category);
    List<Product> findByCategoryAndSubCategory(String category, String subCategory);
    List<Product> findByClassLevel(String classLevel);
    List<Product> findByCategoryAndClassLevel(String category, String classLevel);
    List<Product> findByCategoryAndSubCategoryAndClassLevel(String category, String subCategory, String classLevel);
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByAvailableTrue();
}
