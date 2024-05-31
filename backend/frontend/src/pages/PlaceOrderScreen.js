import React, { useState, useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link,useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import Message from "../components/message";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
function PlaceOrderScreen() {
  const orderCreate=useSelector(state=>state.orderCreate)
  const{error,order,success}=orderCreate
  const cart = useSelector((state) => state.cart);
  const [itemsPrice, setItemsPrice] = useState(null);
  const [shippingPrice, setShippingPrice] = useState(null);
  const [taxPrice, setTaxPrice] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const dispatch=useDispatch()
  const navigate=useNavigate()
  
  useEffect(() => {
    const calculatePrices = () => {
      const calculatedItemsPrice = cart.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
      const calculatedShippingPrice = calculatedItemsPrice > 699 ? 0 : 70;
      const calculatedTaxPrice = 0.042 * calculatedItemsPrice;
      const calculatedTotalPrice =
        calculatedItemsPrice + calculatedShippingPrice + calculatedTaxPrice;
  
      // Round the calculated prices to 2 decimal places
      const roundedItemsPrice = Number(calculatedItemsPrice.toFixed(2));
      const roundedShippingPrice = Number(calculatedShippingPrice.toFixed(2));
      const roundedTaxPrice = Number(calculatedTaxPrice.toFixed(2));
      const roundedTotalPrice = Number(calculatedTotalPrice.toFixed(2));
  
      setItemsPrice(roundedItemsPrice);
      setShippingPrice(roundedShippingPrice);
      setTaxPrice(roundedTaxPrice);
      setTotalPrice(roundedTotalPrice);
    };
  
    calculatePrices();
  }, [cart]);
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, navigate]);

useEffect(()=>{
if(success){
  navigate(`/orders/${order._id}`)
  dispatch({type:ORDER_CREATE_RESET})

}
},[success,navigate,order,dispatch])
  const placeOrder = () => {
    dispatch(createOrder({
      orderItems:cart.cartItems,
      shippingAddress:cart.shippingAddress,
      paymentMethod:cart.paymentMethod,
      itemsPrice:itemsPrice,
      shippingPrice:shippingPrice,
      taxPrice:taxPrice,
      totalPrice:totalPrice,

    }))
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Shipping:</strong>
                <br />
                {cart.shippingAddress.address},
                <br />
                {cart.shippingAddress.city},
                <br />
                {cart.shippingAddress.country}
                <br />
                {cart.shippingAddress.notes}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Method</h2>
              <p>
                <strong>Method:</strong>
                <br />
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message variant="info">Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X EGP {item.price} = EGP {" "}
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                        
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>EGP {Number(itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>EGP {Number(shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>EGP {Number(taxPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>EGP {Number(totalPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <div className="align-center">
                  <Button
                    type="button"
                    className="btn-block"
                    disabled={cart.cartItems === 0}
                    onClick={placeOrder}
                  >
                    Place Order
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;
