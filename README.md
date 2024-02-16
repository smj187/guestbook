# Guestbook Project

## Overview

This Guestbook project introduces a modern, interactive online guestbook where users can leave messages and comments through a rich interface. Leveraging Docker for ease of use ensures that the environment is consistent and executable on any machine. Designed with a focus on user experience and security, the Guestbook allows for seamless interaction and administration. The frontend is developed as a Progressive Web App (PWA), enabling a highly responsive, app-like experience accessible across all modern browsers on both desktop and mobile devices.


### Features

- **Dynamic Entry Viewing**: Users can browse through past entries with ease, thanks to a paginated display.
- Rich Text and Drawing Input: A form equipped with Facebook's Lexical editor provides rich text editing capabilities.
- **Canvas:** A drawing canvas where users can enter their message using a tablet.
- **Secure Admin Backend:** Manage guestbook entries through a secure, password-protected admin dashboard.
- **Progressive Web App (PWA):** The frontend is designed as a PWA, offering an app-like experience that is fast, reliable, and engaging, even in offline scenarios or on low-quality networks.

### Technical Stack
- **Backend**: A simple yet powerful CRUD API built with PHP, featuring pagination to efficiently manage guestbook entries. The data is stored in a SQLite database, providing a lightweight and easy-to-configure solution for data persistence without the need for a complex database server setup.
- **Frontend**: A modern web application utilizing Vue 3 and Tailwind CSS for a responsive and intuitive user interface. The Lexical editor enhances text input, while a drawing canvas adds a creative outlet for users.
- **Containerization**: The entire application is containerized using Docker, emphasizing ease of deployment and environment consistency across different setups.

## Installation
Before proceeding, ensure Docker is installed on your machine. Follow these steps to get the Guestbook up and running:
```bash
git clone https://github.com/smj187/guestbook.git
cd guestbook
docker-compose up --build
```

## Usage

The application and admin dashboard are accessible after installation via:

**Main Application:**
```bash
http://127.0.0.1:5173
```
**Admin Dashboard:**
```bash
http://127.0.0.1:5173/admin
```

## Preview
![Dashboard](/assets/dashboard.png "Dashboard")
![Text Input](/assets/enter-text.png "Text Input")
![Canvas Input](/assets/enter-canvas.png "Canvas Input")
![Admin Dashboard](/assets/admin.png "Admin Dashboard")
