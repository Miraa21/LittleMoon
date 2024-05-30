import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, FormCheck, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";

function PaymentScreen() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("");

 
  if (!shippingAddress.address) {
    navigate("/shipping");
  }
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };
  const handlePaymentMethodChange = (e) => {
    const selectedMethod = e.target.value;
    setPaymentMethod(selectedMethod);
  };
  

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <FormCheck
              type="radio"
              label="Cash on Delivery"
              id="cash"
              name="paymentMethod"
              value="Cash on Delivery"
              checked={paymentMethod === "Cash on Delivery"}
              onChange={handlePaymentMethodChange}
            ></FormCheck>
          </Col>
        </Form.Group>
  
        <Button type="submit" variant="secondary" className="mt-3">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default PaymentScreen;
