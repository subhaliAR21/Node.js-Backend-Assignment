# 🍽️ Node.js Menu Management Backend

This project implements a comprehensive RESTful API for managing a tiered menu system, divided into **Categories**, **Subcategories**, and **Items**, as required by the internship assignment.

The backend is built using **Node.js**, **Express.js**, and **MongoDB** (via Mongoose).

## 🚀 Getting Started

Follow these steps to set up and run the application locally.

### Prerequisites

* **Node.js** (v14 or higher)
* **npm** (Node Package Manager)
* **MongoDB Atlas** or a local MongoDB instance.

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone [Your GitHub Repository URL]
    cd menu-management-backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Create a file named **`.env`** in the root directory and add the following:

    ```env
    PORT=3000
    # Replace the URI with your actual MongoDB connection string
    MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/menu_db?retryWrites=true&w=majority
    ```

4.  **Run the Server:**
    ```bash
    npm start
    ```
    The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## 🌐 API Endpoints (Using Postman)

The base URL for all endpoints is `http://localhost:3000/api/v1`.

### Category Endpoints (`/categories`)

| Objective | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **CREATE** | `POST` | `/categories` | Create a new Category. |
| **GET All** | `GET` | `/categories` | Get all Categories. |
| **GET By ID**| `GET` | `/categories/:id` | Get Category details by ID. |
| **EDIT** | `PATCH` | `/categories/:id` | Update Category attributes. |

### SubCategory Endpoints (`/subcategories`)

| Objective | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **CREATE** | `POST` | `/categories/:categoryId/subcategories` | Create a Subcategory linked to a specific Category. |
| **GET All** | `GET` | `/subcategories` | Get all Subcategories (from all Categories). |
| **GET Nested**| `GET` | `/categories/:categoryId/subcategories` | Get all Subcategories under a specific Category. |
| **GET By ID**| `GET` | `/subcategories/:id` | Get Subcategory details by ID. |
| **EDIT** | `PATCH` | `/subcategories/:id` | Update Subcategory attributes. |

### Item Endpoints (`/items`)

| Objective | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **CREATE** | `POST` | `/items` | Create a new Item (requires `category` ID in body). |
| **GET All** | `GET` | `/items` | Get all Items. |
| **GET Nested (Cat)**| `GET` | `/categories/:categoryId/items` | Get all Items under a Category. |
| **GET Nested (SubCat)**| `GET` | `/subcategories/:subCategoryId/items` | Get all Items under a Subcategory. |
| **GET By ID**| `GET` | `/items/:id` | Get Item details by ID. |
| **EDIT** | `PATCH` | `/items/:id` | Update Item attributes. |
| **SEARCH** | `GET` | `/items/search?name=keyword` | Search items by partial, case-insensitive name match. |

---

## 📝 Assignment Questions

### 1. Which database you have chosen and why?

I chose **MongoDB** with **Mongoose** (ODM).

* **Rationale:** MongoDB's **flexible document structure** is ideal for managing the hierarchical nature of the menu (Category $\rightarrow$ Sub Category $\rightarrow$ Item). Mongoose provides schema enforcement and powerful querying, simplifying the implementation of relational logic (referencing) and ensuring data validation within a Node.js environment.

### 2. 3 things that you learned from this assignment?

1.  **Complex Data Integrity Logic**: Implemented business rules like **defaulting SubCategory tax** from the parent Category and using Mongoose middleware (`pre('save')`) to ensure the **`totalAmount`** field on the Item model is always accurately calculated (`baseAmount - discount`) before saving.
2.  **Advanced RESTful Design**: Structured the API with both standard resource routes (`/items`) and **nested routes** (`/categories/:categoryId/items`) to logically represent the data hierarchy, enabling powerful filtering.
3.  **Search Implementation**: Implemented a robust item search function using MongoDB's `$regex` operator for **case-insensitive, partial string matching**.

### 3. What was the most difficult part of the assignment?

The most challenging aspect was implementing the **conditional default logic for SubCategory creation** (Step 13). This required asynchronously fetching the parent Category's document within the `createSubCategory` controller to obtain default tax values, while also handling potential errors like invalid Category IDs or missing fields, all within a single transaction.

### 4. What you would have done differently given more time?

Given more time, I would focus on **production readiness and code quality**:

* **Robust Input Validation**: Implement a dedicated validation library (like **Joi** or **Zod**) separate from Mongoose models to validate incoming request payloads before they reach the controller logic.
* **Testing**: Write comprehensive **unit and integration tests** using Jest or Mocha/Chai to ensure all business logic (especially tax/discount calculations and nested route filtering) is fully reliable.
* **Authentication/Authorization**: Implement a basic mechanism (e.g., using JWTs) to protect the `POST` and `PATCH` routes, ensuring only authorized users can modify the menu data.