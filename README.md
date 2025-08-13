# PayVistaAdmin

This project is a full-stack application with a Laravel backend and a Next.js frontend, fully containerized with Docker. It allows users to submit their salary details (including local currency) and provides a professional admin panel to view and manage these details in real-time.

## Tech Stack

-   **Backend:** Laravel 11
-   **Frontend:** Next.js 14 (with TypeScript)
-   **Database:** MySQL 8
-   **Styling:** Tailwind CSS
-   **Containerization:** Docker & Docker Compose

## Core Features

-   **User Submission Form:** Users can submit their name, email, salary amount, and specify their local currency from a dropdown list.
-   **Unique Email Handling:** Submitting with an existing email updates the user's record instead of creating a new one, as per the requirements.
-   **Professional Admin Dashboard:** A real-time dashboard for viewing all user submissions in a clean, tabular format.
-   **Intuitive "Edit/Save/Cancel" Workflow:** Admins can click "Edit" on any row to modify all relevant fields at once. The interface provides clear visual feedback during the save process.
-   **Calculated Display Salary:** The `Displayed Salary` is automatically calculated in the backend (`Salary (EUR) + Commission`) and updates instantly on the frontend after an edit.

## Prerequisites

-   Docker
-   Docker Compose

## How to Run the Project

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/felixojiambo/PayVistaAdmin.git
    cd PayVistaAdmin
    ```

2.  **Create an environment file:**
    Copy the `.env.example` to `.env` and customize the `DB_PASSWORD` if needed.
    ```bash
    cp .env.example .env
    ```

3.  **Build and start the containers:**
    This single command will build and start all services in the background.
    ```bash
    docker-compose up --build -d
    ```

4.  **Run database migrations:**
    This only needs to be done once to set up the database tables correctly.
    ```bash
    docker-compose exec app php artisan migrate:fresh
    ```

5.  **Access the applications:**
    -   **User Form:** [http://localhost:3000](http://localhost:3000)
    -   **Admin Panel:** [http://localhost:3000/admin](http://localhost:3000/admin)
    -   **Backend API:** [http://localhost:8000/api/salaries](http://localhost:8000/api/salaries)

