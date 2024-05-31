import "./bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Routes, Route, HashRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./pages/HomeScreen";
import ProductScreen from "./pages/ProductScreen";
import CartScreen from "./pages/CartScreen";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import ProfileScreen from "./pages/ProfileScreen";
import ShippingScreen from "./pages/ShippingScreen";
import PaymentScreen from "./pages/PaymentScreen";
import PlaceOrderScreen from "./pages/PlaceOrderScreen";
import OrderScreen from "./pages/OrderScreen";
import UserListScreen from "./pages/UserListScreen";
import UserEditScreen from "./pages/UserEditScreen";
import ProductListScreen from "./pages/ProductListScreen";
import ProductEditScreen from "./pages/ProductEditScreen";
import OrderListScreen from "./pages/OrderListScreen";

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
            <Routes>
              <Route path="/" Component={HomeScreen} exact />
              <Route path="/login" Component={LoginScreen} />
              <Route path="/register" Component={RegisterScreen} />
              <Route path="/profile" Component={ProfileScreen} />
              <Route path="/shipping" Component={ShippingScreen} />
              <Route path="/payment" Component={PaymentScreen} />
              <Route path="/placeorder" Component={PlaceOrderScreen} />
              <Route path="/orders/:id" Component={OrderScreen} />
              <Route path="/products/:id" element={<ProductScreen />} />
              <Route path="/cart/:id?" element={<CartScreen />} />
              <Route path="/admin/userList" element={<UserListScreen />} />
              <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
              <Route
                path="/admin/product/:id/edit"
                element={<ProductEditScreen />}
              />
              <Route
                path="/admin/productlist/"
                element={<ProductListScreen />}
              />
              <Route path="/admin/orderlist" element={<OrderListScreen />} />
            </Routes>
        
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
