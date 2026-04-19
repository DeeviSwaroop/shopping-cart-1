package com.example.cart.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    private String name;

    /** Top-level: BOOKS, STATIONERY, TOYS */
    @Indexed
    private String category;

    /** Sub-category e.g. TEXTBOOKS, NOTEBOOKS, PENS, PENCILS, ACTION_FIGURES */
    @Indexed
    private String subCategory;

    /**
     * Target class/grade: "LKG","UKG","1","2",..."10" or "ALL"
     */
    @Indexed
    private String classLevel;

    /** Curriculum subject / author for books */
    private String subject;

    private String author;

    private String description;

    private String imageUrl;

    private double price;

    private int stockQuantity;

    private boolean available;
}
