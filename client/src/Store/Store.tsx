"use client";  // For Next.js to enable client-side rendering
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authSlice from "./auth/authSlice";

// Create the store
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  },
  devTools: process.env.NODE_ENV !== 'production', // Enable devTools only in development mode
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Function to initialize the app and load the user on every page load
export const initializeApp = async () => {
  try {
    // Optionally: Check if the user is already logged in using token stored in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // You might want to dispatch an action to set the token in the auth state here
    }

    // Dispatch the API call to load the user
    await store.dispatch(
      apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true })
    );
  } catch (error) {
    console.error("Failed to load user:", error);
  }
};

// Immediately invoke initializeApp to run on page load
initializeApp();
