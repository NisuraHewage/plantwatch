import './App.css';
import React from 'react';

import Notification from '../src/components/notification/notification';
import Register from '../src/components/login/registration';
import Login from '../src/components/login/login';
import Vitals from '../src/components/vitals/vitals';
import Device from '../src/components/device/device';
import AddPlant from '../src/components/device/addPlant';
import AddDevice from '../src/components/device/addDevice';
import Disease from '../src/components/disease/disease';

import {initializePush} from '../src/initializePush';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {activeComponent : "login", vitals: {temperature: 51, moisture: 14}};
  }

  componentDidMount(){
    initializePush();
  }

  checkLogin(){
    // if the vitals request succeeds

    // route them to vitals 

    this.switchComponent("vitals");
    
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
      return (<Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/vitals">Vitals</Link>
              </li>
              <li>
                <Link to="/diseases">Diseases</Link>
              </li>
              <li>
                <Link to="/devices">Devices</Link>
              </li>
              <li>
                <Link to="/notifications">Notifications</Link>
              </li>
            </ul>
          </nav>
  
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/vitals">
              <Vitals />
            </Route>
            <Route path="/devices">
              <Device />
            </Route>
            <Route path="/diseases">
              <Disease />
            </Route>
            <Route path="/addPlant">
              <AddPlant />
            </Route>
            <Route path="/addDevice">
              <AddDevice />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/notifications">
              <Notification />
            </Route>
            <Route path="/">
              <Login />
            </Route>
          </Switch>
        </div>
      </Router>);
    }
}

export default App;