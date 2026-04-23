import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";
import { CartProvider } from "./context/CartContext.tsx";

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
