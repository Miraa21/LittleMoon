import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Loader from "../components/loader"; // Capitalize 'Loader'
import Message from "../components/message";
import Paginate from "../components/Paginate"; // Capitalize 'Message'
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import ProductCarousel from "../components/ProductCarousel";
import { useLocation } from "react-router-dom";

function HomeScreen() {
  const dispatch = useDispatch();
  const location = useLocation();

  const productList = useSelector((state) => state.productList);
  const { error, loading, products, page, pages } = productList;
  let keyword = location.search;
  // console.log(keyword)
  useEffect(() => {
    dispatch(listProducts(keyword));
  }, [dispatch, keyword]);

  return (
    <div>
    {!keyword && <ProductCarousel /> }
      
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Row>
            {Array.isArray(products) &&
              products.map(
                (
                  product 
                ) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                )
              )}
          </Row>
          <Paginate page={page} pages={pages} keyword={keyword} />
        </div>
      )}
    </div>
  );
}

export default HomeScreen;
