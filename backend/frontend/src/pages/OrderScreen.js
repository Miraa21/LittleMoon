import React, { useState, useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Message from "../components/message";
import Loader from "../components/loader";
import { getOrderDetails,deliverOrder,payOrder } from "../actions/orderActions";
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from "../constants/orderConstants";

function OrderScreen({ match }) {
  const { id } = useParams();
  const orderId = id;
  const orderDetails = useSelector((state) => state.orderDetails);
  const { error, order, loading } = orderDetails;
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo} = userLogin;
  
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { success:successDeliver, loading:loadingDeliver } = orderDeliver;
  
  const orderPay = useSelector((state) => state.orderPay);
  const { success: successPay, loading: loadingPay } = orderPay;

  const [itemsPrice, setItemsPrice] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !error && order) {
      const calculatedItemsPrice = order.orderItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
      setItemsPrice(Number(calculatedItemsPrice.toFixed(2)));
    }
  }, [order, loading, error]);
  useEffect(() => {
    if(!userInfo){
      navigate('/login')
    }
    if (!order || order._id !== Number(orderId)||successDeliver||successPay) {
      dispatch({type:ORDER_PAY_RESET})
      dispatch({type:ORDER_DELIVER_RESET})
      dispatch(getOrderDetails(orderId));
    }
  }, [order, orderId, dispatch,successDeliver,successPay,userInfo,navigate]);
  const payHandler = () => {
    dispatch(payOrder(order._id));
  };

  const deliverHandler=()=>{
    dispatch(deliverOrder(order))
  }
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <h1>Order: {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              {/* from serializer */}
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>


              <p>
                <strong>Shipping: </strong>
                <br />
                {order.shippingAddress.address},
                <br />
                {order.shippingAddress.city},
                <br />
                {order.shippingAddress.country}
                <br />
                {order.shippingAddress.notes}
              </p>
              {order.isDelivered ?(
                <Message variant='success'>Delivered on {order.deliveredAt.substring(0, 10)}</Message>

              ):(
                <Message variant='warning'>Not Delivered</Message>
              )}
           
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong>
                <br />
                {order.paymentMethod}
              </p>
              {order.isPaid ?(
                <Message variant='success'>Paid on {order.paidAt.substring(0, 10)}</Message>

              ):(
                <Message variant='warning'>Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message variant="info">No previous orders to show</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
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
                          {item.qty} X EGP{item.price} = EGP {" "}
                          {Number((item.qty * item.price).toFixed(2))}
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
                  <Col>EGP {Number(order.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>EGP {Number(order.taxPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>EGP {Number(order.totalPrice)}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
            {userInfo && userInfo.isAdmin && (
                <ListGroup.Item>
                  {!order.isPaid && (
                    <Button type="button" className="btn btn-block m-2" onClick={payHandler}>
                      Mark as Paid
                    </Button>
                  )}
                  {order.isPaid && !order.isDelivered && (
                    <Button type="button" className="btn btn-block m-2" onClick={deliverHandler}>
                      Mark as Delivered
                    </Button>
                  )}
                </ListGroup.Item>
              )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderScreen;
