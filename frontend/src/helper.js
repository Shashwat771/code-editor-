import { useState } from "react";

export const toggleClass = (el, className) => {
  let elem = document.querySelector(el);
  elem.classList.toggle(className);
};

export const removeClass = (el, className) => {
  let elem = document.querySelector(el);
  elem.classList.remove(className);
};

// API Base URL - uses environment variable or defaults to localhost for development
export const api_base_url = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

console.log("API Base URL:", api_base_url); // Debug log

