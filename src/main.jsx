import { StrictMode } from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter , Routes ,Route, Navigate} from "react-router";
import ProtectedRoute from "./components/protectedredirect.jsx";
import App from "./App.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/login.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/notes" replace/>} />

            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />

            <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
             />
          </Routes>
      </BrowserRouter>
  </StrictMode>
)
