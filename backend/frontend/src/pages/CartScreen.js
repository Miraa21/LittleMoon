import React, { useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
} from "react-bootstrap";
import Message from "../components/message";
import { addToCart, removeFromCart } from "../actions/cartActions";
function CartScreen() {
  let { id } = useParams();
  const location = useLocation();
  let navigate = useNavigate();
  const productId = id;
  const qty = location.search ? Number(location.search.split("=")[1]) : 1;


  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;


  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    } else {
    }

    return () => {};
  }, [dispatch, productId, qty]);
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkout = () => {
    navigate('/shipping')
  };
  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        <Link to="/" className="btn btn-light m-3">
          Go Back
        </Link>
        {cartItems.length === 0 ? (
          <Message variant="info">Your cart is empty</Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/products/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>EGP {item.price}</Col>
                  <Col md={3}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {
                        //[0,1,2,...]
                        [...Array(item.stock).keys()].map((x) => (
                          <option value={x + 1} key={x + 1}>
                            {x + 1}
                          </option>
                        ))
                      }
                    </Form.Control>
                  </Col>
                  <Col md={1}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h2>
              Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}){" "}
            </h2>
            EGP 
            {cartItems
              .reduce((acc, item) => acc + item.qty * item.price, 0)
              .toFixed(2)}
          </ListGroup.Item>
        </ListGroup>

        <ListGroup.Item>
          <Button
            type="button"
            className="btn-block"
            disabled={cartItems.length === 0}
            onClick={checkout}
          >
            {" "}
            Proceed To Checkout
          </Button>
        </ListGroup.Item>
      </Col>
    </Row>
  );
}

export default CartScreen;
