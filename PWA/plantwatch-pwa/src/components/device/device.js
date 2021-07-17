
import React from "react";



import {apiURL} from "../../consts";

import {
  Link
} from "react-router-dom";

  export default class Device extends React.Component {

    constructor(props){
        super(props);
        this.state = {devices: [], selectedDevice: {DeviceID: 1}, plants: []}

        this.state.selectedDeviceId = localStorage.getItem('selectedDevice');

        this.refreshPlants = this.refreshPlants.bind(this);
        this.selectDevice = this.selectDevice.bind(this);
    }

    componentDidMount(){
        this.refreshDevices();
    }

    refreshDevices(){
        // Send request

        // save token

      let userId = localStorage.getItem('userId');
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

    selectDevice(e){
        let newDevice = e.target.getAttribute('data-deviceid');

        console.log(newDevice)
        localStorage.setItem('selectedDevice', newDevice);
        this.setState({selectedDeviceId: newDevice})
    }

    render() {

        /* let deviceMarkup =  this.state.devices.length > 0 ? (
            <select onChange={this.refreshPlants}>
              {this.state.devices.map(d => (<option value={d.DeviceID} key={d.Id}>{d.DeviceID}</option>))}
            </select>
          ) : (<h2>No Devices</h2>) */
        
        let plantMarkup = this.state.plants.length > 0 ? (
            <ul>
                {this.state.plants.map(p => (<li key={p.Id}>{p.Name}</li>))}
            </ul>
        ) : (<h2>No Plants</h2>)


            let deviceMarkup = this.state.devices.length > 0 ? (
                <div>
                  {this.state.devices.map(d => (
                  <div onClick={this.selectDevice} className={(this.state.selectedDeviceId && this.state.selectedDeviceId == d.DeviceID)
                   ? "device-card" : "device-card not-selected"} data-deviceid={d.DeviceID} key={d.Id}>
                    <span className="device-status-devices">{d.Status ? "Active" : "Inactive"}</span>
                      <span className="device-name-label-devices">Device Name</span>
                      <span className="device-name-span-devices">{d.DeviceName || 'IWuvPlants'}</span>
                      <span className="plant-tracking-span-devices">Tracking: </span> 
                      <div className="plant-list-devices">
                      {d.plants.reverse().slice(0,1).map(p => (<div className="plant-details-devices"><span>{p.Name}</span> <img src={p.profile.ImageUrl}/> </div>))}
                      </div>
                    </div>))}
                </div>
              ) : (<h2>{/* No Devices */}</h2>)

      return (
      
        <>
        <h1 className="section-heading">Devices</h1>

        <div className="device-list-devices">
            {deviceMarkup}

        </div>

        <div className="new-device-devices">
            <Link to={{ pathname: '/addDevice'}}>Add Another Device</Link>
        </div>
        </>
      );
    }
  }
