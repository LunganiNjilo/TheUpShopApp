import { FunctionComponent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader } from '../Loader';
import { CurrencyFormatter } from '../CurrencyFormatter';
import classes from './products.module.scss';

const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/products';

export type Product = {
  id: string;
  sku?: string;
  name: string;
  price: number;
  imageUrl?: string;
  availableQuantity?: number;
};

export const Products: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : data.products ?? []);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <Loader />;
  if (error)
    return (
      <h3 className={classes.error}>
        An error occurred when fetching data. Please check the API and try again.
      </h3>
    );

  return (
    <section className={classes.productPage}>
      <h1>Products</h1>
      <div className={classes.container}>
        {products.map((product) => (
          <div className={classes.product} key={product.id}>
            {/* Relative Link */}
            <Link to={`/product/${product.sku ?? product.id}`} className={classes.productLink}>
              {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
              <h3>{product.name}</h3>
            </Link>
            <p>Price: <CurrencyFormatter amount={product.price} /></p>
          </div>
        ))}
      </div>
    </section>
  );
};
