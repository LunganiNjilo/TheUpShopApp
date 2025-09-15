import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Products } from './components/Products/Products';
import { Footer } from './components/Footer';
import { Cart } from './components/Cart';
import { ProductDetails } from './components/Products/ProductDetails';
import classes from './app.module.scss'; // SCSS module

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className={classes.mainContent}>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/product/:sku" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
