import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import MessageBox from '../components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';
import axios from 'axios';

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`)
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  }

  const removeItemHandler = (item) => {
    ctxDispatch({type: 'CART_REMOVE_ITEM', payload: item})
  }

  const checkOutHandler = () => {
    navigate('/signin?redirect=/shipping')
  }

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1 className="text-color-white">Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item
                  key={item._id}
                  className="cart-screen__list-item"
                >
                  <Row className="align-items-center text-color-white">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail cart-screen__img"
                      ></img>{' '}
                      <Link
                        to={`/product/${item.slug}`}
                        className="text-color-white"
                      >
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant="dark"
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle" />
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="dark"
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle" />
                      </Button>{' '}
                    </Col>
                    <Col md={3}>{item.price}</Col>
                    <Col md={2}>
                      <Button
                        variant="dark"
                        onClick={() => removeItemHandler(item)}
                      >
                        <i className="fas fa-trash" />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card className="set-bg-pri">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="set-bg-pri">
                  <h3 className="text-color-white">
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : $
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item className="set-bg-pri">
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkOutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
