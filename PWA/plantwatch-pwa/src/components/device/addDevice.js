
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
        this.state = {confirmed: false, submitted: false, wizardState: 'unbound'}

        this.connectDevice = this.connectDevice.bind(this);
        this.createDevice = this.createDevice.bind(this);

        this.updatePassword = this.updatePassword.bind(this);
        this.updateSSID = this.updateSSID.bind(this);
        this.sendDetailsToCharacteristic = this.sendDetailsToCharacteristic.bind(this);

    }
    
    createDevice(){
        let userToken = localStorage.getItem('userToken');
        let userId = localStorage.getItem('userId');
        let body = JSON.stringify({
            userId,
            deviceId: this.state.deviceUUID
        })
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

    sendDetailsToCharacteristic(){
      
      let userId = localStorage.getItem('userId');
      navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
      })
      .then(device => { 
        console.log("connecting to " + device.name);
        // Attempts to connect to remote GATT Server.
        return device.gatt.connect();
      })
      .then(server => {
        // Getting Service…
        console.log(server)
        return server.getPrimaryService("4fafc201-1fb5-459e-8fcc-c5c9c331914b");
      }).then(service => {console.log(service);
      return service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');}) .then(characteristic => characteristic.startNotifications())
      .then(characteristic => { 
      console.log(characteristic);
      //const resetEnergyExpended = Uint8Array.of(1);
      let encoder = new TextEncoder('utf-8');

      characteristic.addEventListener('characteristicvaluechanged',
      function (event) {
        let encoder = new TextDecoder('utf-8');
          console.log(event.target.value);
          console.log(encoder.decode(event.target.value));
          let decodedConfirmation = encoder.decode(event.target.value);

          if(event.target.value == "1"){
              this.setState({ confirmed: true });
              //this.createDevice();
          }else{
            alert("These credentials didn't work or device is not in range!")
            this.setState({ submitted: true })
          }

        });
        // ssid:password:deviceId:userId
        let credentialString = `${this.state.SSID}:${this.state.Password || ""}:${this.state.deviceUUID}:${userId}`;

      return characteristic.writeValue(encoder.encode(credentialString));
      }).then(_ => {
        console.log('Successfully sent details');
/* 
        // Read characteristic again after 10 seconds
        setTimeout( () => {

              navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
            })
            .then(device => { 
                console.log("connecting to " + device.name);
                // Attempts to connect to remote GATT Server.
                return device.gatt.connect();
            })
            .then(server => {
                // Getting Service…
                console.log(server)
                return server.getPrimaryService("4fafc201-1fb5-459e-8fcc-c5c9c331914b");
            }).then(service => {console.log(service);
                    return service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');})
                    .then(characteristic => characteristic.startNotifications()).then(characterictics => { 
                      console.log(characterictics);
                      characterictics.addEventListener('characteristicvaluechanged',
                      function (event) {
                        let encoder = new TextEncoder('utf-8');
                          console.log(event.target.value);
                          console.log(encoder.decode(event.target.value));
                          let decodedConfirmation = encoder.decode(event.target.value);

                          if(decodedConfirmation == "success"){
                              this.setState({ confirmed: true })
                          }else{
                            alert("These credentials didn't work or device is not in range!")
                            this.setState({ submitted: true })
                          }

                        });
                    return characterictics.readValue();})

                      }, 10000); // End of timeout */

      })
    }

    connectDevice(e){

        let uuid = uuidv4();
        // send to device
        this.setState({deviceUUID: uuid});

        this.sendDetailsToCharacteristic();
        return;

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

    updateWizard(newState){
      this.setState({wizardState: newState});
    }

    render() {
      // render states - unbound, searching, connected, chooseplant1, chooseplant2, nameplant

      let addDeviceContainer = (<></>);

      switch(this.state.wizardState){
        case "unbound":
          addDeviceContainer = (<div className="add-device-unbound"> 
            <h1>Send Credentials to Device</h1>
            <h2>Input the SSID and Password. Upon connection read the confirmation characteristic and if it's successful send create request</h2>
            <input placeholder="SSID" onChange={this.updateSSID} name="SSID"/>
            <input placeholder="Password" onChange={this.updatePassword} name="password"/>
            <button disabled={this.state.submitted} onClick={this.connectDevice}>{!this.state.submitted ? "Confirm" : "Please Wait for Device to Connect"}</button>   

          </div>);
        break;
        case "searching":
          addDeviceContainer = (<div className="add-device-searching">


          </div>);
        break;
        case "connected":
          addDeviceContainer =  (<div className="add-device-connected">

            
          </div>);
        break;
        case "chooseplant1":
          addDeviceContainer = (<div className="add-device-chooseplant1">

            
          </div>);
        break;
        case "chooseplant2":
          addDeviceContainer =  (<div className="add-device-chooseplant2">

            
          </div>);
        break;
        case "nameplant":
          addDeviceContainer =  (<div className="add-device-nameplant">

            
          </div>);
        break;
      }

        let redirectComponent = this.state.confirmed ? (<Redirect to="/devices" />) : 
        (
            <>
            {
              addDeviceContainer
            }
            
            </>
          )
      return redirectComponent;
    }
  }
