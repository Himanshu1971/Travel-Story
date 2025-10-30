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

4. Start the backend server:  
`node server.js` or `npm run dev` (if using nodemon)  
Backend server defaults to port 5000 or as configured.

## Usage

- Register or log in to your account
- Create new travel stories with a title, description, and photo upload
- Browse existing stories displayed as cards
- Click on a card to view the full travel experience details

## Folder Structure Overview

- `frontend/` : React.js app with Tailwind CSS styling
- `backend/`  : Node.js API server with Express and Multer for uploads
- `backend/models` : MongoDB schemas
- `backend/routes` : API endpoints for authentication and stories

## Contributing

Contributions are welcome! Please fork the repo and submit a pull request.

## License

This project is licensed under the MIT License.

