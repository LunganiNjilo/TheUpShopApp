import { FunctionComponent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader } from '../Loader';
import { CurrencyFormatter } from '../CurrencyFormatter';
import classes from './products.module.scss';

const API_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5150/api/products';

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
    fetchData(API_URL);
  }, []);

  async function fetchData(url: string) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : data.products ?? []);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  if (error)
    return (
      <h3 className={classes.error}>
        An error occurred when fetching data. Please check the API and try again.
      </h3>
    );
  if (isLoading) return <Loader />;

  return (
    <section className={classes.productPage}>
      <h1>Products</h1>

      <div className={classes.container}>
        {products.map((product) => (
          <div className={classes.product} key={product.id}>
            <Link
              to={`/product/${product.sku ?? product.id}`}
              className={classes.productLink}
            >
              <img src={product.imageUrl} alt={product.name} />
              <h3>{product.name}</h3>
            </Link>

            <p>
              Price: <CurrencyFormatter amount={product.price} />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
