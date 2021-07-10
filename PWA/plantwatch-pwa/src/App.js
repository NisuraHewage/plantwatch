import logo from './logo.svg';
import './App.css';
import React from 'react';

import Login from '../src/components/login/login';
import Vitals from '../src/components/vitals/vitals';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {activeComponent : "login", vitals: {temperature: 51, moisture: 14}};
  }

  componentDidMount(){
    this.checkLogin();

  }

  checkLogin(){
    // if the vitals request succeeds

    // route them to vitals 

    this.switchComponent("vitals");
    this.setState({vitals: { temperature: 24, moisture: 25}})
  }

  switchComponent(component){
    this.setState({ activeComponent : component});
  }

  render(){
    var content;

    switch(this.state.activeComponent){
      case "login":
        content =  (
          <div className="App">
            
            <Login />
          </div>
          );
      break;
      case "vitals":
        content =  (
          <div className="App">
            
            <Vitals vitals={this.state.vitals} />
            <button onClick={this.switchComponent.bind(this,"vitals")}>Vitals</button>
            <button onClick={this.switchComponent.bind(this,"diseases")}>Diseases</button>
            <button onClick={this.switchComponent.bind(this,"devices")}>Devices</button>
          </div>
          );

      break;
        default:

          content =  (
            <div className="App">
              
              {this.state.activeComponent}
  
              <button onClick={this.switchComponent.bind(this,"vitals")}>Vitals</button>
            </div>
            );
          break;

    }
      return content;
    }
}

export default App;
