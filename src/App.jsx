// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import About from "./components/About/About";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Notfound from "./components/Notfound/Notfound";
import { HeroUIProvider } from "@heroui/react";
import Profile from "./components/Profile/Profile";
import AuthContextProvider from "./Context/AuthContext";
import ProtectedRoute from "./components/Protected/ProtectedRoute";
import AuthProtectedRoute from "./components/AuthProtectedRoute/AuthProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostDetails from "./components/PostDetails/PostDetails";
import { ToastContainer } from "react-toastify";
import DetectOffline from "./components/DetectOffline/DetectOffline";

const query = new QueryClient();
let routes = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    // errorElement: <NotFound />,
    children: [
      {
        path: "about",
        element: (
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        ),
      },
      {
        path: "register",
        element: (
          <AuthProtectedRoute>
            <Register />
          </AuthProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "postdetails/:id",
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: (
          <AuthProtectedRoute>
            <Login />
          </AuthProtectedRoute>
        ),
      },
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <Notfound /> },
    ],
  },
]);
export default function App() {
  return (
    <>
      <DetectOffline />
      <QueryClientProvider client={query}>
        <AuthContextProvider>
          <HeroUIProvider>
            <RouterProvider router={routes}></RouterProvider>
            <ToastContainer />
          </HeroUIProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}
