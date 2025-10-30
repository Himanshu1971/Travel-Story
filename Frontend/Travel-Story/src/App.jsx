import React from 'react';
import {BrowserRouter as Router,Routes,Route,Navigate} from "react-router-dom";
import Login from "./Pages/Auth/login";
import Signup from "./Pages/Auth/signup";
import Home from "./Pages/Auth/home/Home"
export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path = "/" exact element={<Root/>}></Route>
          <Route path = "/dashboard" exact element={<Home/>}></Route>
          <Route path = "/login" exact element={<Login/>}></Route>
          <Route path = "/signup" exact element={<Signup/>}></Route>
        </Routes>
      </Router>
    </div>
  )
}

// Define the Root components to handle initial redirect
const Root = () => {
  // Check if token exist in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  // Redirect to dashboard if authenticated else to dashboard
  return isAuthenticated?(
    <Navigate to = "/dashboard"/>
  ):(
    <Navigate to = "/login"/>
  )
}
