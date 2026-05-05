import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { SettingsProvider } from "./context/SettingsContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
