# Backend API for Company and Service Management

## Overview

This project is a backend API developed in **Node.js** and **TypeScript**, designed to manage companies and their services. The API interacts with a **MySQL** database and is fully containerized with **Docker** to ensure a consistent and isolated environment.

## 📋 Key Technical Choices

* **`express-validator`**: Implemented for robust input validation on all API endpoints, ensuring data integrity.
* **Postman**: We opted for a Postman Collection for API documentation. We choose Postman over Swagger for this task because it allows for faster creation of testable, shareable API documentation without requiring any additional code integration, which is ideal for a practical timed assessment.

---

## ⚙️ Setup and Installation

### Prerequisites

* **Docker Desktop**: The only dependency required on the host machine. Ensure it's running before you begin.

### Step-by-Step Guide

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/your-username/back-end-test-vista.git](https://github.com/your-username/back-end-test-vista.git)
    cd back-end-test-vista
    ```

2.  **Environment Configuration:**
    Create a `.env` file in the project root. This file is crucial as it contains the database connection string specifically formatted for our Docker Compose setup.
    ```env
    DATABASE_URL="mysql://root:mysecretpassword@db:3306/company_db"
    PORT=3000
    NODE_ENV=development
    ```

3.  **Launch the Application:**
    Run the following command to build the Docker images and start both the backend and database services. This command reads the `docker-compose.yml` file.
    ```bash
    docker-compose up --build
    ```

4.  **Run Database Migrations:**
    After the containers are running, open a **new terminal** and run the command below to create the database tables using Prisma.
    ```bash
    docker exec -it backend-app npx prisma migrate dev --name init
    ```

---

## ⭐ Bonus Features Implemented

* **Request Logging**: A middleware is in place to log the method, path, and timestamp of every incoming request.
* **Input Validation**: `express-validator` is used on all `POST` endpoints to ensure data is correctly formatted before processing.
* **Dockerization**: The entire backend is containerized for easy and consistent deployment.

---

## 🧪 API Documentation and Testing

The API endpoints are documented in a Postman collection.

1.  **Import Postman Collection**: Import the `postman-collection.json` file, located in the root of this repository, into your Postman application.
2.  **Test Endpoints**: The collection is pre-configured with a `base_url` variable. You can now test all endpoints, including `GET /health`, `POST /companies`, `GET /companies`, `POST /services`, and `GET /services/:id`.
