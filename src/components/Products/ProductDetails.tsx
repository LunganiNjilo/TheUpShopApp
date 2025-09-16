import { FunctionComponent, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLocalStorageState from 'use-local-storage-state';
import { Loader } from '../Loader';
import { CurrencyFormatter } from '../CurrencyFormatter';
import classes from './product-details.module.scss';

export type Product = {
  id: string;
  sku?: string;
  name: string;
  price: number;
  availableQuantity?: number;
  imageUrl?: string;
  quantity?: number;
};

export interface CartProps {
  [productId: string]: Product;
}

const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/products';

export const ProductDetails: FunctionComponent = () => {
  const { sku } = useParams<{ sku: string }>();
  const navigate = useNavigate();

  // Ensure cart is always an object to avoid TS warning
  const [cart = {}, setCart] = useLocalStorageState<CartProps>('cart', {});

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`${API_URL}/${sku}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [sku]);

  const addToCart = () => {
    if (!product) return;

    setCart((prevCart = {}) => ({
      ...prevCart,
      [product.id]: { ...product, quantity: 1 },
    }));
  };

  if (isLoading) return <Loader />;
  if (error || !product) return <p>Product not found.</p>;

  const inCart = Boolean(cart[product.id]);

  return (
    <section className={classes.productDetails}>
      <button className={classes.backButton} onClick={() => navigate('/')}>
        ← Back to Products
      </button>

      {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
      <h2>{product.name}</h2>
      <p>SKU: {product.sku ?? 'N/A'}</p>
      <p>Price: <CurrencyFormatter amount={product.price} /></p>
      <p>Available: {product.availableQuantity ?? 'N/A'}</p>

      <button
        disabled={inCart}
        onClick={addToCart}
        style={{
          marginTop: '1rem',
          backgroundColor: '#fbd815',
          borderRadius: '25px',
          width: '13rem',
          padding: '.5rem',
          fontSize: '1.1em',
          border: '1px solid #D5D9D9',
          cursor: inCart ? 'not-allowed' : 'pointer',
        }}
      >
        {inCart ? 'Already in Cart' : 'Add to Cart'}
      </button>
    </section>
  );
};
