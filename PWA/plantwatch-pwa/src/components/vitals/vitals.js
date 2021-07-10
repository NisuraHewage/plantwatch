
import React from "react";

import {apiURL} from "../../consts";

export default class Vitals extends React.Component {

    constructor(props){
        super(props);
        
        console.log(props);
        this.state = {vitals: props.vitals};
    }

    refreshValues(){
        // Call every 5 seconds
        fetch(`${apiURL}readings?deviceId=${15}`)
        .then(response => response.json())
        .then(data => console.log(data));
    }

  

  render() {
    return (
    <>
      <h1>Temperature {this.state.vitals.temperature}</h1>

      <h1>Moisture {this.state.vitals.moisture}</h1>

      <button onClick={this.refreshValues.bind(this)} >Refresh vitals</button>
    </>
    );
  }
}
