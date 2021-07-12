
import React from "react";



import {apiURL} from "../../consts";

import {
  Link
} from "react-router-dom";

  export default class Device extends React.Component {

    constructor(props){
        super(props);
        this.state = {devices: []}
    }

    componentDidMount(){
        this.refreshDevices();
    }

    refreshDevices(){
        // Send request

        // save token

        localStorage.setItem('userId', 1);
      let userId = localStorage.getItem('userId');
      localStorage.setItem('userToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFobWVkbmlzaGFkM0BnbWFpbC5jb20iLCJ1c2VySWQiOjEsImlhdCI6MTYyNjA2MjQwNiwiZXhwIjoxNjU3NTk4NDA2fQ.dsobmm8q2Yb6HtQ0tjxkYTj2Asgf5aOoQGtljeidHNs');
      let userToken = localStorage.getItem('userToken');

        // Call every 5 seconds
        fetch(`${apiURL}devices?userId=${userId}`,{ 
          headers: new Headers({
            'Authorization': 'Bearer '+ userToken 
          })})
        .then(response => response.json())
        .then(deviceData => {
          console.log(deviceData);
          // get the first device id and send
           this.setState({devices: deviceData.result});
          if(deviceData.result && deviceData.result.length != 0){
            fetch(`${apiURL}plants?deviceId=${deviceData.result[0].DeviceID}`,{ 
              headers: new Headers({
                'Authorization': 'Bearer '+ userToken 
              })})
              .then(response => response.json())
              .then(plantData => {
                console.log(plantData);
                /* if(vitalData.readings && vitalData.readings.length != 0){
                  this.setState({ vitals: vitalData.readings[0] })
                } */
              } );
            }
              
        });
    }

    

    render() {

        let deviceMarkup = (
            <select>
              {this.state.devices.map(d => (<option key={d.Id}>{d.DeviceId}</option>))}
            </select>
          )

      return (
      
        <>
        {deviceMarkup}
        <h1>Hello, Babbe</h1>
        <label>Email</label><input name="email" type="text"/>
        <label>Password</label><input name="password" type="password"/>
        <Link to="/addDevice">New Device</Link>
        </>
      );
    }
  }
