import React from 'react'
import {Form,Button,Container} from 'react-bootstrap';
import './style.css';
import {Link} from 'react-router-dom';

const Login = () => {
    return (
       <div className='form-container'>
       <Form className='login-form'>
           <h1>Login</h1>
  <Form.Group className='mb-4' controlId="formBasicEmail">
    <Form.Label>Name</Form.Label>
    <Form.Control type='text' placeholder='Enter Name' />
  </Form.Group>
  <Form.Group className='mb-4' controlId="formBasicEmail">
    <Form.Label>Email address</Form.Label>
    <Form.Control type="email" placeholder="Enter email" />
  </Form.Group>

  <Form.Group className='mb-4' controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" placeholder="Password" />
  </Form.Group>
  <Button className='mb-4' variant="secondary" type="submit">
    Submit
  </Button>
  <p>Not yet registered? <Link to= '/signup'>Sign up here</Link></p>
</Form>
</div>
    )
}

export default Login
