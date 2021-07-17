
import React from "react";

import {apiURL, timeSince} from "../../consts";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import {
  Link
} from "react-router-dom";

// Import Swiper styles
import 'swiper/swiper-bundle.css';
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css"
import "swiper/components/navigation/navigation.min.css"


import SwiperCore, {
  Pagination,Navigation
} from 'swiper/core';

// install Swiper modules
SwiperCore.use([Pagination,Navigation]);

export default class Vitals extends React.Component {

    constructor(props){
        super(props);
        this.state = {vitals: { temperature: 0, moisture: 0, Timestamp: 5645654}, devices: []}
    }

    componentDidMount(){
      this.refreshValues();
    }

    refreshValues(){
      let userId = localStorage.getItem('userId');
      let userToken = localStorage.getItem('userToken');

        // Call every 5 seconds
        fetch(`${apiURL}devices?userId=${userId}`,{ 
          headers: new Headers({
            'Authorization': 'Bearer '+ userToken 
          })})
        .then(response => response.json())
        .then(deviceData => {
          // get the first device id and send
           this.setState({devices: deviceData.result});

           let selectedDeviceId = localStorage.getItem('selectedDevice');
           let selectedDevice = deviceData.result[0];
           if(selectedDeviceId){
            selectedDevice = deviceData.result.filter(d => d.DeviceID == selectedDeviceId)[0]; 
           }else{
            localStorage.setItem('selectedDevice', selectedDevice.DeviceID);
           }

          if(deviceData.result && deviceData.result.length != 0){
            fetch(`${apiURL}readings?deviceId=${deviceData.result[0].DeviceID}`,{ 
              headers: new Headers({
                'Authorization': 'Bearer '+ userToken 
              })})
              .then(response => response.json())
              .then(vitalData => {
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
        {this.state.devices.map(d => (<option key={d.Id}>{d.DeviceID}</option>))}
      </select>
    )

    let swiperMarkup = (
      /* <Swiper
      spaceBetween={50}
      slidesPerView={3}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      <SwiperSlide>Slide 1</SwiperSlide>
      <SwiperSlide>Slide 2</SwiperSlide>
      <SwiperSlide>Slide 3</SwiperSlide>
      <SwiperSlide>Slide 4</SwiperSlide>
    </Swiper> */
    <Swiper pagination={{
      "type": "fraction"
    }} navigation={true} className="mySwiper"
    onSlideChange={(e) => console.log(e)}
    onSwiper={(swiper) => console.log(swiper)}
    >

      {this.state.devices.length > 0 ? (this.state.devices.filter(d => d.DeviceID == localStorage.getItem('selectedDevice'))[0].plants.map(p => (
      <SwiperSlide>
      <div className="plant-slide">
        <img src={p.profile.ImageUrl} />
        <h1>{p.Name}</h1>
        <h2>{p.profile.Name}</h2>
      </div></SwiperSlide>)
      )) : <><SwiperSlide>Loading Plants</SwiperSlide></>}

      {this.state.devices.length > 0 ? ( <SwiperSlide> 
      <Link to={{ pathname: '/addPlant', search: `?deviceId=${this.state.devices[0].Id}` }}>New Plant</Link>
        </SwiperSlide>) : (<></>)}
     
      </Swiper>
    )

    return (
    <>
    <h1 className="section-heading">Vitals</h1>

    <div className="device-selection-vitals">
      {swiperMarkup}
    </div>

      <div className="vitals-breakdown-vitals">
        <div className="vital-card">
          <h1>Temperature</h1>
          <span className="tag">
          {this.state.vitals.Temperature} C
        </span>
        </div>
        <div className="vital-card">
          <h1>Soil Moisture</h1>
          <span className="tag">
          {this.state.vitals.Moisture}%
        </span>
        </div>
        <div className="vital-card">
          <h1>Humidity</h1>
          <span className="tag">
          {this.state.vitals.Humidity}%
        </span>
        </div>
        <div className="vital-card">
          <h1>Light</h1>
          <span className="tag">
          {this.state.vitals.Light} Lux
        </span>
        </div>
      </div>

      <div className="last-reading-vitals">
        <h2>Last reading was {timeSince(new Date(this.state.vitals.Timestamp))} ago</h2>
      </div>

    </>
    );
  }
}
