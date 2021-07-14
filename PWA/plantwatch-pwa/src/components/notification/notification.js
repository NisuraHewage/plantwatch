


  
import React from "react";



import {apiURL} from "../../consts";

import {
  Link,
  useLocation
} from "react-router-dom";

function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

  export default class Notification extends React.Component {

    constructor(props){
        super(props);
        
        this.state = {notifications: []}

        this.readNotification = this.readNotification.bind(this);
        this.clearAllNotifications = this.clearAllNotifications.bind(this);
    }

    componentDidMount(){
        this.refreshNotifications();
    }

    refreshNotifications(){
        // Send request

        // save token
      let userToken = localStorage.getItem('userToken');
      let userId = localStorage.getItem('userId');
        // Call every 5 seconds
        fetch(`${apiURL}notification?userId=${userId}`,{ 
          headers: new Headers({
            'Authorization': 'Bearer '+ userToken 
          })})
        .then(response => response.json())
        .then(notificationData => {
          console.log(notificationData);
          if(notificationData.results && notificationData.results.length != 0){
            this.setState({ notifications: notificationData.results })
          }
        });
    }

    readNotifications(ids){
        console.log(this.state);
        let userToken = localStorage.getItem('userToken');
        let userId = localStorage.getItem('userId');
        let body = JSON.stringify({
            notifications: ids
        })
        console.log(body);
        fetch(`${apiURL}notification/read`,{ 
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

    clearAllNotifications(e){
      this.setState({notifications: []});
        this.readNotifications(this.state.notifications.map(n => { return {NotificationId: n.NotificationId, Timestamp: n.Timestamp}}));
    }

    readNotification(e){
      let selectedId = e.target.getAttribute('data-notificationId');
      let selectedTimestamp = this.state.notifications.filter(n => n.NotificationId == selectedId)[0].Timestamp;
      this.setState({notifications: this.state.notifications.filter(n => n.NotificationId != selectedId)})
      this.readNotifications([{NotificationId: selectedId, Timestamp:  selectedTimestamp}]);
    }

    render() {

        let notificationsMarkup = this.state.notifications.length > 0 ? (
            <ul >
              {this.state.notifications.map(d => (<li onClick={this.readNotification} data-notificationId={d.NotificationId} key={d.NotificationId}>{timeSince(new Date(d.Timestamp))} ago - {d.Message}</li>))}
            </ul>
          ) : (<h2>All caught up!</h2>)

      return (
      
        <>
        <h1>Notifications</h1>
        {notificationsMarkup}
        <button onClick={this.readNotifications}>Clear</button>
        </>
      );
    }
  }
