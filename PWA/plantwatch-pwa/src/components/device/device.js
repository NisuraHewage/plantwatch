
import React from "react";



import {apiURL} from "../../consts";

import {
  Link
} from "react-router-dom";

  export default class Device extends React.Component {

    constructor(props){
        super(props);
        this.state = {devices: [], selectedDevice: {DeviceID: 1}, plants: []}

        this.refreshPlants = this.refreshPlants.bind(this);
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
            this.setState({selectedDevice: deviceData.result[0]});
            fetch(`${apiURL}plants?deviceId=${deviceData.result[0].Id}`,{ 
              headers: new Headers({
                'Authorization': 'Bearer '+ userToken 
              })})
              .then(response => response.json())
              .then(plantData => {
                console.log(plantData);
                if(plantData.result && plantData.result.length != 0){
                  this.setState({ plants: plantData.result })
                }
              } );
            }
              
        });
    }

    refreshPlants(event){
        let userToken = localStorage.getItem('userToken');
        let deviceID = event.target.value;
        this.setState({selectedDevice: this.state.devices.filter(d => d.DeviceID == deviceID)[0]});
        console.log(this.state);

        fetch(`${apiURL}plants?deviceId=${this.state.selectedDevice.Id}`,{ 
            headers: new Headers({
              'Authorization': 'Bearer '+ userToken 
            })})
            .then(response => response.json())
            .then(plantData => {
              console.log(plantData);
              if(plantData.result && plantData.result.length != 0){
                this.setState({ plants: plantData.result })
              }else{
                this.setState({ plants: [] })
              }
            } );
    }

    render() {

        let deviceMarkup =  this.state.devices.length > 0 ? (
            <select onChange={this.refreshPlants}>
              {this.state.devices.map(d => (<option value={d.DeviceID} key={d.Id}>{d.DeviceID}</option>))}
            </select>
          ) : (<h2>No Devices</h2>)
        
        let plantMarkup = this.state.plants.length > 0 ? (
            <ul>
                {this.state.plants.map(p => (<li key={p.Id}>{p.Name}</li>))}
            </ul>
        ) : (<h2>No Plants</h2>)

      return (
      
        <>
        <h1>Devices</h1>
        {deviceMarkup}
        <h1>Plants</h1>
        {plantMarkup}
        <Link to={{ pathname: '/addDevice'}}>New Device</Link>
        <Link to={{ pathname: '/addPlant', search: `?deviceId=${this.state.selectedDevice.DeviceID}` }}>New Plant</Link>
        </>
      );
    }
  }
