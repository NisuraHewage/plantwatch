
import React from "react";



import {apiURL} from "../../consts";

import {
  Link,
  useLocation,
  Redirect
} from "react-router-dom";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  export default class AddDevice extends React.Component {

    constructor(props){
        super(props);
        
        // get deviceId from query
        this.state = {confirmed: false}

        this.connectDevice = this.connectDevice.bind(this);
        this.createDevice = this.createDevice.bind(this);

        this.updatePassword = this.updatePassword.bind(this);
        this.updateSSID = this.updateSSID.bind(this);
    }
    
    createDevice(){
        console.log(this.state);
        let userToken = localStorage.getItem('userToken');
        let userId = localStorage.getItem('userId');
        let body = JSON.stringify({
            userId,
            deviceId: this.state.deviceUUID
        })
        console.log(body);
        fetch(`${apiURL}devices`,{ 
            method: 'POST',
            headers: new Headers({
              'Authorization': 'Bearer '+ userToken ,
              'Content-Type': 'application/json'
            }),
            body
        })
            .then(response => response.json())
            .then(createResponse => {
              console.log(createResponse);
              this.setState({confirmed: true})
            } );
        
        // redirect to devices view
    }

    connectDevice(e){
        e.target.innerText = "Please Wait for Device to Connect";
        e.target.disabled = true
        let uuid = uuidv4();
        // send to device
        this.setState({deviceUUID: uuid});


        // wait for confirmation
        setTimeout(
            ()=>{
                // read characteristic
                let confirmationCharacteristic = 1;
                if(confirmationCharacteristic == 1){
                    this.createDevice();
                } 
            }, 2000
        )
    }

    updateSSID(e){
        this.setState({SSID: e.target.value});
    }

    updatePassword(e){
        this.setState({Password: e.target.value});
    }

    render() {

        let redirectComponent = this.state.confirmed ? (<Redirect to="/devices" />) : 
        (
            <>
            <h1>Send Credentials to Device</h1>
            <h2>Input the SSID and Password. Upon connection read the confirmation characteristic and if it's successful send create request</h2>
            <input placeholder="SSID" onChange={this.updateSSID} name="SSID"/>
            <input placeholder="Password" onChange={this.updatePassword} name="password"/>
            <button onClick={this.connectDevice}>Confirm</button>
            </>
          )
      return redirectComponent;
    }
  }
