# StudyShop – Full-Stack Shopping Cart
### Books, Stationery & Toys for LKG to Class 10

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 6, Axios, STOMP/SockJS |
| Middle tier | Java 17, Spring Boot 3.2, Spring Security |
| Database | MongoDB |
| Auth | JWT (access + refresh tokens in httpOnly cookies) |
| Real-time | Spring WebSocket / STOMP |

---

## Pre-requisites

### macOS

- **Java 17** – `brew install openjdk@17`
- **Maven 3.9+** – `brew install maven`
- **Node 18+** – `brew install node`
- **MongoDB 7+** – `brew install mongodb-community` and `brew services start mongodb-community`

### Windows

- **Java 17** – Download and install from [Adoptium](https://adoptium.net/) or [Oracle](https://www.oracle.com/java/technologies/downloads/#java17). Add `JAVA_HOME` to your environment variables.
- **Maven 3.9+** – Download from [maven.apache.org](https://maven.apache.org/download.cgi), extract, and add the `bin` folder to your `PATH`.
- **Node 18+** – Download the Windows installer from [nodejs.org](https://nodejs.org/).
- **MongoDB 7+** – Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community). Optionally install as a Windows service during setup, or start manually with `mongod`.

> **Verify installations (both OS):**
> ```bash
> java -version && mvn -v && node -v && npm -v && mongod --version
> ```

---

## Running the Application

### 1. Start MongoDB

**macOS**
```bash
brew services start mongodb-community
```

**Windows (if not installed as a service)**
```powershell
# Open a terminal and run:
mongod --dbpath "C:\data\db"
```
> Create the `C:\data\db` folder first if it doesn't exist: `mkdir C:\data\db`

### 2. Start Backend (Spring Boot)

**macOS**
```bash
cd backend
export JAVA_HOME="$(brew --prefix openjdk@17)/libexec/openjdk.jdk/Contents/Home"
mvn spring-boot:run
```

**Windows (PowerShell)**
```powershell
cd backend
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17"   # adjust to your install path
mvn spring-boot:run
```

**Windows (Command Prompt)**
```cmd
cd backend
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17
mvn spring-boot:run
```

The API starts on **http://localhost:8080**.  
On first boot, ~50 seed products (books, stationery, toys) are inserted automatically.

### 3. Start Frontend (React)

```bash
cd frontend
npm install
npm start
```
Opens **http://localhost:3000**. Proxies `/api` requests to `:8080`.

> Works the same on macOS and Windows.

---

## Application Flow

```
1. Visit /           → Landing page (featured books, stationery, toys, authors)
2. Browse categories → /browse (filter by category, sub-category, class level)
3. Product detail    → /products/:id (real-time stock via WebSocket)
4. Login / Register  → /login  (JWT stored in httpOnly cookie)
5. Add to Cart       → live inventory check on every add/update/remove
6. Checkout          → /checkout (choose payment method, place order)
7. Payment confirm   → API confirms payment, deducts stock
8. Confirmation page → success ✅ or failure ❌ screen
9. Order History     → /orders (expandable past orders with status)
```

---

## JWT / Session Behaviour

| Token | Expiry | Storage |
|---|---|---|
| Access token | 15 min | httpOnly cookie `access_token` |
| Refresh token | 7 days | httpOnly cookie `refresh_token` |

- Axios automatically intercepts **401** responses and calls `/api/auth/refresh`.
- If the refresh token is also expired, the user is redirected to `/login`.
- Logout deletes both cookies and the server-side refresh token record.

---

## REST API Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, get cookies |
| POST | `/api/auth/refresh` | ❌ | Refresh access token |
| POST | `/api/auth/logout` | ❌ | Clear cookies |
| GET | `/api/auth/me` | ✅ | Current user info |
| GET | `/api/products` | ❌ | List products (filter: category, subCategory, classLevel, search) |
| GET | `/api/products/featured` | ❌ | Top 4 per category for homepage |
| GET | `/api/products/:id` | ❌ | Product detail |
| GET | `/api/products/:id/inventory` | ❌ | Live stock count |
| GET | `/api/cart` | ✅ | User's cart |
| POST | `/api/cart/add` | ✅ | Add item (checks stock) |
| PUT | `/api/cart/update` | ✅ | Update qty (checks stock) |
| DELETE | `/api/cart/remove/:id` | ✅ | Remove item |
| DELETE | `/api/cart/clear` | ✅ | Empty cart |
| POST | `/api/orders/place` | ✅ | Create order from cart |
| POST | `/api/orders/payment/confirm` | ✅ | Confirm payment (success/fail) |
| GET | `/api/orders/history` | ✅ | Past orders |
| GET | `/api/orders/:id` | ✅ | Single order |

### WebSocket (STOMP)
- Connect: `ws://localhost:8080/ws` (SockJS fallback)
- Subscribe: `/topic/inventory/{productId}` → `{ productId, availableQty }`
- Broadcasts on every cart add/remove/update and payment confirmation

---

## Product Categories

```
BOOKS
  ├── TEXTBOOKS       (LKG, UKG, 1–10)
  └── STORY_BOOKS     (ALL)

STATIONERY
  ├── PENS / PENCILS / NOTEBOOKS
  ├── GEOMETRY / SKETCH_PENS / CRAYONS / PAINTS
  ├── CRAFT / ERASERS / SHARPENERS
  └── BAGS

TOYS
  ├── EDUCATIONAL / PUZZLES / SCIENCE_KITS
  ├── BOARD_GAMES / SOFT_TOYS / ACTION_FIGURES
  └── CRAFT_TOYS
```

---

## Configuration (`backend/src/main/resources/application.properties`)

```properties
jwt.secret=ThisIsASecretKeyThatIs32CharsLong!!   # change in production
jwt.access-token-expiry-ms=900000                # 15 min
jwt.refresh-token-expiry-ms=604800000            # 7 days
app.frontend-url=http://localhost:3000
spring.data.mongodb.uri=mongodb://localhost:27017/cartdb
```
