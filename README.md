# Travel Story Application

A full-stack web app to capture, share, and explore travel experiences. Users can register/login, create story cards with photos, and view detailed travel stories. The app uses React.js with Tailwind CSS for the frontend and Node.js with Express and MongoDB for the backend. Multer handles photo uploads.

## Features

- User authentication with login and signup
- Create and display travel experiences as cards
- Upload photos with Multer integration
- Click cards to view detailed stories
- Responsive UI styled with Tailwind CSS
- Backend REST API with Node.js and MongoDB

## Technologies Used

- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express, Multer
- Database: MongoDB

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB instance (local or cloud)

### Installation

#### Frontend Setup

1. Clone this repository  
2. Navigate to the frontend directory:  
   `cd frontend`  
3. Install dependencies:  
   `npm install`  
4. Start the development server:  
   `npm start`  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

#### Backend Setup

1. Navigate to the backend directory:  
   `cd backend`  
2. Install dependencies:  
   `npm install`  
3. Create a `.env` file based on `.env.example` and configure your MongoDB connection string and other environment variables. Example:  
