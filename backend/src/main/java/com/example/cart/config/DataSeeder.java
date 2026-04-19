package com.example.cart.config;

import com.example.cart.model.Product;
import com.example.cart.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    @Bean
    @Profile("!test")
    public CommandLineRunner seed(ProductRepository repo) {
        return args -> {
            if (repo.count() > 0) {
                log.info("Products already seeded, skipping.");
                return;
            }
            log.info("Seeding products...");
            List<Product> products = List.of(
                // ── BOOKS ──────────────────────────────────────────────────
                p("English Reader – LKG", "BOOKS", "TEXTBOOKS", "LKG", "English", "Oxford", 85.0, 50),
                p("Maths Activity Book – LKG", "BOOKS", "TEXTBOOKS", "LKG", "Maths", "Frank Brothers", 90.0, 40),
                p("English Primer – UKG", "BOOKS", "TEXTBOOKS", "UKG", "English", "Oxford", 95.0, 45),
                p("Maths Primer – UKG", "BOOKS", "TEXTBOOKS", "UKG", "Maths", "S.Chand", 95.0, 45),
                p("English – Class 1", "BOOKS", "TEXTBOOKS", "1", "English", "NCERT", 60.0, 100),
                p("Maths – Class 1", "BOOKS", "TEXTBOOKS", "1", "Maths", "NCERT", 60.0, 100),
                p("EVS – Class 2", "BOOKS", "TEXTBOOKS", "2", "EVS", "NCERT", 65.0, 90),
                p("Maths – Class 3", "BOOKS", "TEXTBOOKS", "3", "Maths", "NCERT", 70.0, 80),
                p("Science – Class 5", "BOOKS", "TEXTBOOKS", "5", "Science", "NCERT", 75.0, 70),
                p("Science – Class 7", "BOOKS", "TEXTBOOKS", "7", "Science", "NCERT", 85.0, 60),
                p("History – Class 8", "BOOKS", "TEXTBOOKS", "8", "History", "NCERT", 80.0, 55),
                p("Chemistry – Class 10", "BOOKS", "TEXTBOOKS", "10", "Chemistry", "NCERT", 95.0, 50),
                p("Physics – Class 10", "BOOKS", "TEXTBOOKS", "10", "Physics", "NCERT", 95.0, 50),
                p("Maths – Class 10", "BOOKS", "TEXTBOOKS", "10", "Maths", "R.D.Sharma", 250.0, 40),
                p("The Diary of a Young Girl", "BOOKS", "STORY_BOOKS", "ALL", "Fiction", "Anne Frank", 199.0, 30),
                p("Charlotte's Web", "BOOKS", "STORY_BOOKS", "ALL", "Fiction", "E.B. White", 159.0, 35),
                p("Goosebumps – Night of the Living Dummy", "BOOKS", "STORY_BOOKS", "ALL", "Fiction", "R.L. Stine", 149.0, 40),

                // ── STATIONERY ─────────────────────────────────────────────
                p("HB Pencil (Pack of 10)", "STATIONERY", "PENCILS", "ALL", null, "Nataraj", 35.0, 200),
                p("Colour Pencils – 24 Shades", "STATIONERY", "PENCILS", "ALL", null, "Staedtler", 120.0, 150),
                p("Blue Ball Pen (Pack of 5)", "STATIONERY", "PENS", "ALL", null, "Reynolds", 45.0, 300),
                p("Gel Pen – Multicolour (Pack of 5)", "STATIONERY", "PENS", "ALL", null, "Linc", 75.0, 200),
                p("Single Line Notebook – A5", "STATIONERY", "NOTEBOOKS", "ALL", null, "Classmate", 40.0, 250),
                p("Four-Line Notebook – LKG/UKG", "STATIONERY", "NOTEBOOKS", "LKG", null, "Navneet", 30.0, 180),
                p("Graph Notebook", "STATIONERY", "NOTEBOOKS", "ALL", null, "Navneet", 35.0, 150),
                p("Geometry Box", "STATIONERY", "GEOMETRY", "ALL", null, "Camlin", 65.0, 120),
                p("Eraser (Pack of 4)", "STATIONERY", "ERASERS", "ALL", null, "Apsara", 20.0, 400),
                p("Sharpener", "STATIONERY", "SHARPENERS", "ALL", null, "Apsara", 15.0, 350),
                p("Scale 30 cm", "STATIONERY", "SCALES", "ALL", null, "Classmate", 12.0, 300),
                p("Sketch Pens – 24 Colours", "STATIONERY", "SKETCH_PENS", "ALL", null, "Camlin", 95.0, 180),
                p("Crayons – 16 Colours", "STATIONERY", "CRAYONS", "ALL", null, "Faber-Castell", 85.0, 160),
                p("Watercolour Box", "STATIONERY", "PAINTS", "ALL", null, "Camlin", 110.0, 90),
                p("Scissors (Kids Safe)", "STATIONERY", "CRAFT", "ALL", null, "Faber-Castell", 55.0, 130),
                p("Glue Stick", "STATIONERY", "CRAFT", "ALL", null, "Fevistick", 30.0, 200),
                p("School Bag – LKG", "STATIONERY", "BAGS", "LKG", null, "Wildcraft", 450.0, 60),
                p("School Bag – Class 5-10", "STATIONERY", "BAGS", "5", null, "Skybags", 799.0, 40),

                // ── TOYS ───────────────────────────────────────────────────
                p("Building Blocks (100 pcs)", "TOYS", "EDUCATIONAL", "LKG", null, "Lego", 999.0, 35),
                p("Alphabet Puzzle", "TOYS", "PUZZLES", "LKG", null, "Orchard Toys", 349.0, 50),
                p("Number Puzzle (1-20)", "TOYS", "PUZZLES", "UKG", null, "Orchard Toys", 299.0, 45),
                p("Clay Dough Set", "TOYS", "CRAFT_TOYS", "ALL", null, "Play-Doh", 399.0, 55),
                p("Solar System Model Kit", "TOYS", "SCIENCE_KITS", "5", null, "Einstein Box", 799.0, 25),
                p("Chemistry Lab Kit – Beginners", "TOYS", "SCIENCE_KITS", "7", null, "Einstein Box", 1199.0, 20),
                p("Chess Set", "TOYS", "BOARD_GAMES", "ALL", null, "Syndicate", 299.0, 40),
                p("Scrabble Junior", "TOYS", "BOARD_GAMES", "ALL", null, "Mattel", 499.0, 30),
                p("Ludo & Snakes & Ladders", "TOYS", "BOARD_GAMES", "ALL", null, "Funskool", 199.0, 60),
                p("Carrom Board (Small)", "TOYS", "BOARD_GAMES", "ALL", null, "Precise", 649.0, 20),
                p("Remote Control Car", "TOYS", "ACTION_FIGURES", "ALL", null, "Hot Wheels", 1299.0, 18),
                p("Stuffed Teddy Bear", "TOYS", "SOFT_TOYS", "ALL", null, "Hamleys", 599.0, 25)
            );

            repo.saveAll(products);
            log.info("Seeded {} products.", products.size());
        };
    }

    private Product p(String name, String cat, String sub, String cls,
                      String subject, String author, double price, int stock) {
        Product p = new Product();
        p.setName(name);
        p.setCategory(cat);
        p.setSubCategory(sub);
        p.setClassLevel(cls);
        p.setSubject(subject);
        p.setAuthor(author);
        p.setPrice(price);
        p.setStockQuantity(stock);
        p.setAvailable(stock > 0);
        p.setImageUrl("https://via.placeholder.com/300x200?text=" + name.replace(" ", "+"));
        return p;
    }
}
