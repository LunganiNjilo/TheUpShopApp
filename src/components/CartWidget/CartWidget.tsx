import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorageState from "use-local-storage-state";

import shoppingCart from "../../assets/shopping-cart.svg";
import classes from "./cart-widget.module.scss";

export const CartWidget: FunctionComponent = () => {
  const navigate = useNavigate();
  const [cart] = useLocalStorageState<Record<string, any>>("cart", {});
  const [productsCount, setProductsCount] = useState(0);

useEffect(() => {
  const count = Object.values(cart || {}).reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );
  setProductsCount(count);
}, [cart]);

  const navigateToCart = () => {
    navigate("/cart");
  };

  return (
    <button className={classes.container} onClick={navigateToCart}>
      {productsCount > 0 && (
        <span className={classes.productsCount}>{productsCount}</span>
      )}
      <img src={shoppingCart} className={classes.shoppingCart} alt="Go to Cart" />
    </button>
  );
};
