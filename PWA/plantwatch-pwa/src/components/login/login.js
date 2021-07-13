
import React from "react";



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
        <h1>Hello, Babbe</h1>
        <label>Email</label><input name="email"  onChange={this.updateEmail} type="text"/>
        <label>Password</label><input name="password" onChange={this.updatePassword} type="password"/>
        <button onClick={this.loginRequest} >Login</button>
        <Link to="/registration">New User?</Link>
        </>
      );

      return (<>{markup}</>);
    }
  }
