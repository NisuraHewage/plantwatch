
import React from "react";



import {apiURL} from "../../consts";

import {
  Link, Redirect
} from "react-router-dom";

  export default class Login extends React.Component {

    constructor(props){
        super(props);
        this.state = {isLoggedIn: false}
    }

    loginRequest(){
        // Send request
        let body = JSON.stringify({
            email: this.state.email,
            password: this.state.password,
            deviceToken: localStorage.getItem('deviceToken')
        })
        console.log(body);
        fetch(`${apiURL}user/login`,{ 
            method: 'POST',
            body
        })
            .then(response => response.json())
            .then(createResponse => {
              console.log(createResponse);
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
        <label>Email</label><input name="email"  type="text"/>
        <label>Password</label><input name="password" type="password"/>
        <Link to="/registration">New User?</Link>
        </>
      );

      return markeup;
    }
  }
