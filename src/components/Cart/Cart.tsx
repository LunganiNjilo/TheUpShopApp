import { FunctionComponent, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import { useLocation, useNavigate } from "react-router-dom";

import { Quantifier } from "../Quantifier";
import { TotalPrice } from "../TotalPrice";
import { Operation } from "../Quantifier/Quantifier";
import classes from './cart.module.scss'; 

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export const Cart: FunctionComponent = () => {
  const [cart, setCart] = useLocalStorageState<Record<string, CartItem>>(
    "cart",
    {}
  );
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleRemoveProduct = (productId: string): void => {
    setCart((prevCart) => {
      const updated = { ...prevCart };
      delete updated[productId];
      return updated;
    });
  };

  const handleUpdateQuantity = (productId: string, operation: Operation) => {
    setCart((prevCart) => {
      const updated = { ...prevCart };
      if (updated[productId]) {
        if (operation === "increase") {
          updated[productId] = {
            ...updated[productId],
            quantity: updated[productId].quantity + 1,
          };
        } else if (
          operation === "decrease" &&
          updated[productId].quantity > 1
        ) {
          updated[productId] = {
            ...updated[productId],
            quantity: updated[productId].quantity - 1,
          };
        } else {
          // if quantity hits 0, remove product
          delete updated[productId];
        }
      }
      return updated;
    });
  };

  const getProducts = () => Object.values(cart || {});
  const totalPrice = getProducts().reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  return (
    <section className={classes.cart}>
      <h1>Your Cart</h1>

      {getProducts().length === 0 && <p>Your cart is empty.</p>}

      {getProducts().length > 0 && (
        <div className={classes.container}>
          {getProducts().map((product) => (
            <div className={classes.product} key={product.id}>
              {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
              <h3>{product.name}</h3>
              <Quantifier
                removeProductCallback={() => handleRemoveProduct(product.id)}
                productId={product.id}
                handleUpdateQuantity={handleUpdateQuantity}
              />
            </div>
          ))}
        </div>
      )}

      <TotalPrice amount={totalPrice} />

      <div className={classes.summary}>
        {/* Continue Shopping always visible */}
        <button
          className={classes.continueShopping}
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>

        {/* Checkout only visible when cart has items */}
        {getProducts().length > 0 && (
          <button
            className={classes.checkout}
            onClick={() => alert("Checkout flow coming soon!")}
          >
            Checkout
          </button>
        )}
      </div>
    </section>
  );
};
