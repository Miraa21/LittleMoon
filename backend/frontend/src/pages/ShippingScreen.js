import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";

function ShippingScreen() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [address, setAddress] = useState(
    shippingAddress ? shippingAddress.address : ""
  );
  const [city, setCity] = useState(shippingAddress ? shippingAddress.city : "");
  const [country, setCountry] = useState(
    shippingAddress ? shippingAddress.country : ""
  );
  const [notes, setNotes] = useState(
    shippingAddress ? shippingAddress.notes : ""
  );
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, country, notes }));
    navigate("/payment");
  };
  return (
    <FormContainer>
    <CheckoutSteps step1 step2/>
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter Address"
            value={address ? address : ""}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter City"
            value={city ? city : ""}
            onChange={(e) => setCity(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Country"
            value={country ? country : ""}
            onChange={(e) => setCountry(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="notes">
          <Form.Label>Notes</Form.Label>
          <Form.Control
            as="textarea"
            rows="3"
            placeholder="Do you have any delivering instructions?"
            value={notes ? notes : ""}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="secondary" className="mt-3">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default ShippingScreen;
