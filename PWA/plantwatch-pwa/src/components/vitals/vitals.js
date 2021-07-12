
import React from "react";

import {apiURL} from "../../consts";

export default class Vitals extends React.Component {

    constructor(props){
        super(props);
        this.state = {vitals: { temperature: 0, moisture: 0, Timestamp: 5645654}, devices: []}
    }

    refreshValues(){
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
            fetch(`${apiURL}readings?deviceId=${deviceData.result[0].Id}`,{ 
              headers: new Headers({
                'Authorization': 'Bearer '+ userToken 
              })})
              .then(response => response.json())
              .then(vitalData => {
                console.log(vitalData);
                if(vitalData.readings && vitalData.readings.length != 0){
                  this.setState({ vitals: vitalData.readings[0] })
                }
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
      <h1>Temperature {this.state.vitals.Temperature}</h1>

      <h1>Moisture {this.state.vitals.Moisture}</h1>

      <h1>Humidity {this.state.vitals.Humidity}</h1>

      <h1>Light {this.state.vitals.Light}</h1>

      <h2>Last reading @{(new Date(this.state.vitals.Timestamp).toUTCString())}</h2>

      <button onClick={this.refreshValues.bind(this)} >Refresh vitals</button>
    </>
    );
  }
}
