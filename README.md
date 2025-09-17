# Feed My People System

## Overview

The **Feed My People System** is a web and mobile application developed for the **Feed My People NGO** based in Pretoria, Gauteng. The NGO runs community outreach programmes to support the hungry and vulnerable.

Currently, the organization lacks a digital platform to connect with donors, volunteers, and the public. This system provides a centralized platform for donations, volunteer management, outreach tracking, and communication.

The system is implemented using **React (website)** and **React Native (mobile app)** with **Supabase** for the backend and database.

---

## Features

### User Features

* Authentication: Sign up, log in, and password reset
* Online Donations: Users can make secure online donations
* Volunteer Sign-Up: Register to volunteer via an online form
* Announcements: View updates and news from the NGO
* Gallery: Browse images of outreach programmes
* Chatbot: Get instant responses to common queries
* Contact Form: Reach out to the organization directly
* Information Section: Access key details about the NGO

### Admin Features

* Manage Announcements: Create, update, and delete announcements
* Donation Tracking: Monitor and manage donations
* Volunteer Management: Track volunteer registrations and activities
* Gallery Management: Upload and manage images
* Blog Management: Create, read, update, and delete blog posts

---

## System Architecture

The system follows a **three-layer architecture**:

1. **View Layer (UI/UX)**

   * React (website) and React Native (mobile app)
   * Interfaces designed for accessibility and usability

2. **Domain Layer (Logic & Business Rules)**

   * Application logic implemented in JavaScript
   * Handles authentication, CRUD operations, payments, and chatbot interactions

3. **Data Layer (Database & Storage)**

   * Supabase (PostgreSQL + API) backend
   * Real-time data synchronization across website and mobile app
   * Supports full CRUD operations for blogs, donations, outreach programs, volunteers, and messages

---

## Technologies Used

* **Frontend (Web):** React
* **Mobile App:** React Native
* **Backend & Database:** Supabase (PostgreSQL + API)
* **Languages:** JavaScript, TypeScript, HTML, CSS
* **Architecture:** Three-layer (View, Domain, Data)

---

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/feed-my-people.git
   cd feed-my-people
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server (for web):

   ```bash
   npm start
   ```

4. Run the mobile app (using Expo or React Native CLI):

   ```bash
   npm run android
   npm run ios
   ```

5. Configure environment variables for Supabase API keys in a `.env` file.

---

## Contributors

* **Feed My People NGO** – Project beneficiary
* **Development Team** – System design, development, and deployment

---

## License

This project is for academic and organizational purposes. All rights reserved to Feed My People NGO.

---

