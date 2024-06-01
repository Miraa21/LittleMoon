import React, { useState, useEffect } from "react";
import Rating from "../components/Rating";
import Loader from "../components/loader";
import Message from "../components/message";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  ListGroupItem,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  createProductReview,
  listProductDetails,
} from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";

function ProductScreen() {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [validationError, setValidationError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { product, loading, error } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(id)); // Fetch updated product details
  }, [dispatch, successProductReview, id]);

  const addToCart = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") {
      setValidationError("Please provide both rating and comment.");
    } else {
      const review = {
        rating,
        comment,
      };
      dispatch(createProductReview(id, review));
      setValidationError("");
    }
  };

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                    color={"#F7C566"}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: EGP {product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroupItem>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>EGP {product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </Col>
                    </Row>
                  </ListGroupItem>
                  {product.stock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col className="mt-2">Quantity</Col>
                        <Col xs="auto" className="my-1">
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.stock).keys()].map((x) => (
                              <option value={x + 1} key={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroupItem>
                    <div className="d-grid gap-3">
                      <Button
                        onClick={addToCart}
                        className="btn-primary btn-block"
                        disabled={product.stock === 0}
                        type="button"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col md={6}>
              <h4>Reviews</h4>
              {(!product.reviews || product.reviews.length === 0) && (
                <Message variant="info">No reviews to show</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews &&
                  product.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} color="#f8e825" />
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                <ListGroup.Item>
                  <h4>Leave a Review</h4>
                  {loadingProductReview && <Loader />}
                  {successProductReview && (
                    <Message variant="success">
                      Review Submitted! Thank you for your time
                    </Message>
                  )}
                  {errorProductReview && (
                    <Message variant="danger">{errorProductReview}</Message>
                  )}
                  {validationError && (
                    <Message variant="danger">{validationError}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select Rating</option>
                          <option value="1">1 - Very Dissatisfied</option>
                          <option value="2">2 - Dissatisfied</option>
                          <option value="3">3 - OK</option>
                          <option value="4">4 - Satisfied</option>
                          <option value="5">5 - Very Satisfied</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment" className="mt-2">
                        <Form.Label>Review</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows="5"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                        className="mt-3"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message variant="info">
                      Please <Link to="/login">LogIn</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default ProductScreen;
