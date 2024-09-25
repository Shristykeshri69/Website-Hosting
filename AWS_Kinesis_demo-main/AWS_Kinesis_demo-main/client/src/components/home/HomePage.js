import { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function HomePage() {
    const [apiEndpoint, setApiEndpoint] = useState("https://feo2i6xtu9.execute-api.us-east-1.amazonaws.com/deploy");
    const [products, setProducts] = useState([]);
    const [order, setOrder] = useState({product_id: "", name: "", description: "", price: "", qty: "", userName: "", email: "",producer_mail:""});

    const getProducts = () => {
        try {
            fetch(`${apiEndpoint}/products`)
            .then(res => res.json())
            .then(productData => {
                console.log(productData)
                setProducts(productData.body);
              },
              (error) => {
                console.log('error', error);
              }
            );
        } catch(err) {
            console.log('error', err);
        }
    }

    useEffect(() => {
        getProducts()
    }, []);

    const setOrderedProduct = (evt) => {
        let product_id = evt.target.value;
        let selectedProduct = products.filter(product => product.product_id === product_id);
        selectedProduct = selectedProduct[0];
        console.log(selectedProduct)
        setOrder({
            ...order, 
            product_id: selectedProduct.product_id,
            name: selectedProduct.name,
            description: selectedProduct.description,
            price: selectedProduct.price,
            qty: selectedProduct.qty,
            producer_mail:selectedProduct.email,
        });
    }

    const orderProduct = () => {
        fetch(`${apiEndpoint}/order`, {
            method: 'POST',
            body: JSON.stringify(order),
            headers: {
               'Content-type': 'application/json; charset=UTF-8',
            },
      });
    }

    return (
        <Container>
             <Row className="px-4 my-5">
                <Col sm={5}>
                    <h1 className="font-weight-light">Products App</h1>
                    <hr />

                    <section className="mt-4">
                        <h2>Shipping Information</h2>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicText">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control type="text" placeholder="" 
                                              value={order.userName} 
                                              onChange={evt => setOrder({...order, userName:evt.target.value})} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control type="email" placeholder="" 
                                              value={order.email} 
                                              onChange={evt => setOrder({...order, email:evt.target.value})} />
                            </Form.Group>

                            <h2>Products</h2>
                            <section onChange={setOrderedProduct}>
                            {
                                products.map((product, indx) => {
                                    return (
                                        <Col className="px-2 my-2" key={indx}>
                                            <p>
                                                <input
                                                    type="radio"
                                                    name="productSelect"
                                                    value={product.product_id}
                                                    id={product.product_id}
                                                />
                                                <label htmlFor={product.product_id}>&nbsp;<b>{product.name}</b></label>
                                                <br />{product.description}
                                                <br />${product.price}
                                            </p>
                                        </Col>
                                    )
                                })
                            }
                            </section>

                            <hr />
                            <Button variant="primary" type="button" onClick={orderProduct}>Submit Order &gt;&gt;</Button>&nbsp;                        
                        </Form>
                    </section>
                </Col>
             </Row>
        </Container>
    )
}

export default HomePage;