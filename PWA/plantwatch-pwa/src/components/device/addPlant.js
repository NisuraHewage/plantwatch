
import React from "react";



import {apiURL} from "../../consts";

import {
  Link,
  useLocation
} from "react-router-dom";

  export default class AddPlant extends React.Component {

    constructor(props){
        super(props);
        
        // get deviceId from query
        const urlParams = new URLSearchParams(window.location.search);
        let deviceId = urlParams.get('deviceId');
        this.state = {profiles: [], deviceId}

        this.updateName = this.updateName.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.createPlant = this.createPlant.bind(this);
    }

    componentDidMount(){
        this.refreshPlantProfiles();
    }

    refreshPlantProfiles(){
        // Send request

        // save token
      localStorage.setItem('userToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFobWVkbmlzaGFkM0BnbWFpbC5jb20iLCJ1c2VySWQiOjEsImlhdCI6MTYyNjA2MjQwNiwiZXhwIjoxNjU3NTk4NDA2fQ.dsobmm8q2Yb6HtQ0tjxkYTj2Asgf5aOoQGtljeidHNs');
      let userToken = localStorage.getItem('userToken');

        // Call every 5 seconds
        fetch(`${apiURL}profiles?plantName=`,{ 
          headers: new Headers({
            'Authorization': 'Bearer '+ userToken 
          })})
        .then(response => response.json())
        .then(profileData => {
          console.log(profileData);
          if(profileData.result && profileData.result.length != 0){
            this.setState({ profiles: profileData.result })
          }
        });
    }

    createPlant(event){
        console.log(this.state);
        let userToken = localStorage.getItem('userToken');
        let userId = localStorage.getItem('userId');
        let body = JSON.stringify({
            plantName: this.state.plantName,
            plantProfileId: this.state.profileId,
            userId,
            deviceId: this.state.profileId
        })
        console.log(body);
        fetch(`${apiURL}plants`,{ 
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
              
            } );
        
        // redirect to devices view
    }

    updateName(e){
        this.setState({plantName: e.target.value});
    }

    updateProfile(e){
        this.setState({profileId: e.target.value});
    }

    render() {

        let profileMarkup = (
            <select onChange={this.updateProfile}>
              {this.state.profiles.map(d => (<option value={d.Id} key={d.Id}>{d.Name} - {d.ScientificName}</option>))}
            </select>
          )

      return (
      
        <>
        <h1>Add Plant</h1>
        <h2>Select Profile</h2>
        {profileMarkup}
        <h2>Name</h2>
        <input onChange={this.updateName} name="plantName"/>
        <button onClick={this.createPlant}>Add</button>
        </>
      );
    }
  }
