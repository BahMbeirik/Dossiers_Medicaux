# Dossiers medicaux

## Run Guide

This guide provides instructions on how to set up and run the web application using:

- **Pipenv** for backend dependency management
- **Django REST API** as the backend
- **FLASK** as microservice
- **ReactJS** as the frontend
- **MongoDB** as the database

## Prerequisites

Ensure you have the following installed:

- Python 3.10
- Pipenv
- Node.js & npm
- MongoDB

## Setting Up the Backend (Django)

1. Install dependencies using Pipenv:
   ```bash
   pipenv install
   ```
2. Activate the virtual environment:
   ```bash
   pipenv shell
   ```
3. Apply migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
4. Create a superuser (optional, for accessing the Django admin panel):
   ```bash
   python manage.py createsuperuser
   ```
6. Start the backend server:
   ```bash
   python manage.py runserver
   ```

## Setting Up the Microservice (Flask)
   1.Start flask
    ```bash
   python rate_limiter_service.py
   ```

## Setting Up the Frontend (ReactJS)

1. Navigate to the frontend directory:
   ```bash
   cd ./frontend/
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Running MongoDB

1. Ensure MongoDB is running:
   ```bash
   sudo systemctl start mongod
   ```
2. Check the status:
   ```bash
   sudo systemctl status mongod
   ```

## Accessing the Application

- The **backend API** will be available at: `http://localhost:8000/api/`
- The **flask api** will be available at: `http://127.0.0.1:5000`
- The **frontend app** will be available at: `http://localhost:5173/`

Now your web app is set up and running! 🚀

