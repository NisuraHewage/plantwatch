
import React from "react";

import logo from '../../images/Logo.svg'

import {apiURL} from "../../consts";

import {
  Link, Redirect
} from "react-router-dom";

  export default class Register extends React.Component {

    constructor(props){
        super(props);
        this.state = {isLoggedIn: false}

        this.updateEmail = this.updateEmail.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.registerRequest = this.registerRequest.bind(this);

    }

    loginRequest(){
        // Send request
        let body = JSON.stringify({
            email: this.state.email,
            password: this.state.password,
            deviceToken: localStorage.getItem('deviceToken')
        })
        fetch(`${apiURL}user/login`,{ 
            method: 'POST',
            body
        })
            .then(response => response.json())
            .then(createResponse => {
              localStorage.setItem('userToken', createResponse.token);
              localStorage.setItem('userId', createResponse.userI);
              this.setState({isLoggedIn: true})
            } );
        
        // redirect to devices view
        // save token
    }

    registerRequest(){
        let body = JSON.stringify({
            email: this.state.email,
            password: this.state.password
        })
        fetch(`${apiURL}user`,{ 
            method: 'POST',
            body
        })
            .then(response => response.json())
            .then(createResponse => {
              console.log(createResponse);
                this.loginRequest();
            } );
    }

    updateEmail(e){
      this.setState({ email: e.target.value })
    }

    updatePassword(e){
      this.setState({ password: e.target.value })
    }
    

    render() {

      let markup = this.state.isLoggedIn ? (<> <Redirect to="/devices" /> </>) : (
      
        <>
        <div className="logo-container-register">
          <img src={logo}/>
        </div>
        <div className="login-form-register">
          <label>Email</label><br /><input class="input is-normal input-green-border"  name="email"  onChange={this.updateEmail} type="email"/><br />
          <label>Password</label><br /><input class="input is-normal input-green-border"  name="password" onChange={this.updatePassword} type="password"/><br />
          <button style={{top: "20px"}} class="button large-btn" onClick={this.registerRequest} >Register</button>
        </div>
        <br />
        
        <div className="newuser-container-register">
          <span>Already Registered? </span><Link to="/login">Login</Link>
        </div>

        {/* <h1>Register</h1>
        <label>Email</label><input name="email"  onChange={this.updateEmail} type="email"/>
        <label>Password</label><input name="password" onChange={this.updatePassword} type="password"/>
        <button onClick={this.registerRequest} >Register</button>
        <Link to="/registration">Already Registered?</Link> */}
        </>
      );

      return (<>{markup}</>);
    }
  }
