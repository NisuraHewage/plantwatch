
import React from "react";

import {
  Link
} from "react-router-dom";

  export default class Login extends React.Component {

    constructor(props){
        super(props);
        this.state = {isLogin: true}
    }

    loginRequest(){
        // Send request

        // save token
    }

    

    render() {
      return (
      
        <>
        <h1>Hello, Babbe</h1>
        <label>Email</label><input name="email" type="text"/>
        <label>Password</label><input name="password" type="password"/>
        <Link to="/registration">New User?</Link>
        </>
      );
    }
  }
