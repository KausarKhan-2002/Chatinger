import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UserProvider from "./Context/UserContext.jsx";
import SocketProvider from "./Context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserProvider>
  </SocketProvider>
);
