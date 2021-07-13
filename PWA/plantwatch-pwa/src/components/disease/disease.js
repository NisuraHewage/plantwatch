
import React from "react";



import {apiURL, modelURL} from "../../consts";

import {
  Link,
  useLocation,
  Redirect
} from "react-router-dom";

    function extractBrackets(text ,name){
        try{
            var restOf = text.split(`<${name}>`)[1];
            var between = restOf.split(`</${name}>`)[0];
            return between;
        }catch(e){
            return `<h1>No disease identified!</h1>`
        }
    }

  export default class Disease extends React.Component {

    constructor(props){
        super(props);
        
        // get deviceId from query
        this.state = {receivedResult: false, previewImageUrl: '', selectedPlantProfile: null, profiles: []}

        this.getDisaeaseResult = this.getDisaeaseResult.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        
    }

    readURL(input) {
        if (input) {
          var reader = new FileReader();
          
          reader.onload = (e) => {
              this.setState({previewImageUrl: e.target.result})
          }
          
          reader.readAsDataURL(input); // convert to base64 string
        }
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
              
            this.setState({ profiles: profileData.result, selectedPlantProfile: profileData.result[0] })
          }
        });
    }

    createIdentificationResult(){
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

    getDisaeaseResult(event){
        let selectedFile = event.target.files[0];
        this.readURL(selectedFile);
        const formData  = new FormData();
        formData.append('file', selectedFile, selectedFile.name);
        fetch(`${modelURL}`,{ 
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(createResponse => {
              console.log(createResponse);
              this.getDiseaseMarkup(createResponse);
            } );
    }

    getDiseaseMarkup(disease){
        let userToken = localStorage.getItem('userToken');

        // Call every 5 seconds
        fetch(`${apiURL}profile?profileId=${this.state.selectedPlantProfile.Id}`,{ 
          headers: new Headers({
            'Authorization': 'Bearer '+ userToken 
          })})
        .then(response => response.json())
        .then(profileData => {
          console.log(profileData);
          let diseaseMarkup = profileData.result[0].Diseases;
            let innerHTML = extractBrackets(diseaseMarkup, disease);
            this.setState({receivedResult: true});
            document.getElementById('diseaseBreakdown').innerHTML = innerHTML;
        });
    }

    takePicture(){
        navigator.mediaDevices.getUserMedia({video: true})
        .then(mediaStream => {
            const video = document.querySelector("video");
            const mediaStreamTrack = mediaStream.getVideoTracks()[0];
            video.srcObject = mediaStreamTrack;
            const imageCapture = new ImageCapture(mediaStreamTrack);
            console.log(imageCapture);

            const img = document.querySelector('img');

            /* imageCapture.takePhoto()
            .then(blob => {
                img.src = URL.createObjectURL(blob);
                img.onload = () => { URL.revokeObjectURL(this.src); }
            })
            .catch(error => console.error('takePhoto() error:', error)); */

            /* const canvas = document.querySelector('canvas');
            imageCapture.grabFrame()
            .then(imageBitmap => {
                canvas.width = imageBitmap.width;
                canvas.height = imageBitmap.height;
                canvas.getContext('2d').drawImage(imageBitmap, 0, 0);
            })
            .catch(error => console.error('grabFrame() error:', error)); */

        })
        .catch(error => console.error('getUserMedia() error:', error));
    }

    updateProfile(e){
        this.setState({selectedPlantProfile: this.state.profiles.filter(p => p.Id == e.target.value)[0] });
    }

    render() {

        let profileMarkup = (
            <select onChange={this.updateProfile}>
              {this.state.profiles.map(d => (<option value={d.Id} key={d.Id}>{d.Name} - {d.ScientificName}</option>))}
            </select>
          )

        let redirectComponent = this.state.receivedResult ? (<div id="diseaseBreakdown"></div>) : 
        (
            <>
            <h2>Select Plant</h2>
            {profileMarkup}
            <input onChange={this.getDisaeaseResult} type="file" accept="image/*;capture=camera" />
            <img src={this.state.previewImageUrl}/>
            </>
          )
      return redirectComponent;
    }
  }
