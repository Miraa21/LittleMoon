import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import  SearchBox  from './SearchBox'
import {logout} from '../actions/userActions'
import Banner from './Banner'
import "../index.css";
function Header() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin
  const dispatch=useDispatch()
  const logoutHandler = () => {
    dispatch(logout())
  };
  return (
    <header>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="navbar Navbar"
        collapseOnSelect
      >
        <Container className="Container">
          <LinkContainer to="/">
            <Navbar.Brand>
              <i className="fas fa-moon"></i> Little Moon
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <SearchBox/>
            <Nav className="nav" >
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i> Cart
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username dropdown-basic">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item variant='secondary'> Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link className="Log">
                    <i className="fas fa-user"></i> Login
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin &&(
                <NavDropdown title='Admin' id="adminmenu">
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item variant='secondary'> Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item variant='secondary'> Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item variant='secondary'> Orders</NavDropdown.Item>
                  </LinkContainer>
                  
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Banner/>
    </header>
  );
}

export default Header;
