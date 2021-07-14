
import React from "react";

import logo from '../../images/Logo.svg'
import {apiURL} from "../../consts";

import {
  Link, Redirect
} from "react-router-dom";

  export default class Login extends React.Component {

    constructor(props){
        super(props);
        this.state = {isLoggedIn: false}

        this.updateEmail = this.updateEmail.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.loginRequest = this.loginRequest.bind(this);

    }

    loginRequest(e){
      e.target.disabled = true;
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

    updateEmail(e){
      this.setState({ email: e.target.value })
    }

    updatePassword(e){
      this.setState({ password: e.target.value })
    }
    

    render() {

      let markup = this.state.isLoggedIn ? (<> <Redirect to="/vitals" /> </>) : (
      
        <>
        <div className="logo-container-login">
          <img src={logo}/>
        </div>
        <div className="welcome-container-login">
          <h1 className="h1">Hello!<br/> Welcome to PlantWatch</h1>
        </div>
        <div className="login-form-login">
          <label>Email</label><br /><input class="input is-normal input-green-border"  name="email"  onChange={this.updateEmail} type="email"/><br />
          <label>Password</label><br /><input class="input is-normal input-green-border"  name="password" onChange={this.updatePassword} type="password"/><br />
          <button style={{top: "20px"}} class="button large-btn" onClick={this.loginRequest} >Login</button>
        </div>
        <br />
        
        <div className="newuser-container-login">
          <span>New User? </span><Link to="/register">Register Now</Link>
        </div>
        </>
      );

      return (<>{markup}</>);
    }
  }
