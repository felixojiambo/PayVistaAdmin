# PayVistaAdmin

This project is a full-stack application with a Laravel backend and a Next.js frontend, containerized with Docker. It allows users to submit their salary details and provides an admin panel to view and manage these details.

## Tech Stack

-   **Backend:** Laravel 11
-   **Frontend:** Next.js 14 (with TypeScript)
-   **Database:** MySQL 8
-   **Styling:** Tailwind CSS
-   **Containerization:** Docker & Docker Compose

## Features

-   **User Form:** Users can submit their name, email, and salary.
-   **Unique Email Handling:** Submitting with an existing email updates the user's record instead of creating a new one.
-   **Admin Dashboard:** A real-time dashboard for viewing all user submissions.
-   **Admin Editing:** Admins can directly edit `Salary (Local)`, `Salary (EUR)`, and `Commission` from the table.
-   **Calculated Display Salary:** The `Displayed Salary` is automatically calculated as `Salary (EUR) + Commission`.

## Prerequisites

-   Docker
-   Docker Compose

## How to Run

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/felixojiambo/PayVistaAdmin
    cd PayVistaAdmin
    ```

2.  **Create an environment file:**
    Copy the `.env.example` to `.env` and customize the `DB_PASSWORD`.
    ```bash
    cp .env.example .env
    ```

3.  **Build and start the containers:**
    ```bash
    docker-compose up --build -d
    ```

4.  **Install Laravel dependencies and run migrations:**
    This only needs to be done once.
    ```bash
    docker-compose exec app composer install
    docker-compose exec app php artisan migrate
    ```

5.  **Access the applications:**
    -   **User Form:** [http://localhost:3000](http://localhost:3000)
    -   **Admin Panel:** [http://localhost:3000/admin](http://localhost:3000/admin)
    -   **Backend API:** [http://localhost:8000](http://localhost:8000)

---
