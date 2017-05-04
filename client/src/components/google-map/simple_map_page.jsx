import React, {Component} from 'react';
import PropTypes from 'prop-types';
import GoogleMap from 'google-map-react';
import MyGreatPlace from './my_great_place.jsx';
import { retrieveData } from '../../lib/modules/modules.js';
const GreenMarker = _ => <img src="http://maps.gstatic.com/mapfiles/markers2/icon_green.png"/>;

const RedMarker = _ => <img src="http://maps.gstatic.com/mapfiles/markers2/marker.png"/>;

const BlueDot = _ => <img src="http://maps.gstatic.com/mapfiles/markers2/measle_blue.png"/>;

const mockData = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          id: 0,
          date: '12 April, 2017',
          name: 'Mark Ota',
          type: 'Death',
          cause: 'Diarrhea'
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -157.84521102905273,
            21.29225337295981
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          id: 1,
          date: '7 August, 2021',
          name: 'Aukai Tirrell',
          type: 'Arrest',
          cause: 'Drug trafficking',
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -158.18613052368164,
            21.448595053724944
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          id: 2,
          date: '7 August, 2021',
          name: 'Nick Lee',
          type: 'Death',
          cause: 'Drug overdose',
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -158.1860339641571,
            21.44716707427564
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          id: 3,
          date: '2 February, 2057',
          name: 'Danika Harada',
          type: 'Missing person report',
          cause: 'It was actually just a cat',
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -157.77706146240234,
            21.42270950855108
          ]
        }
      }
    ]
  };

console.log(retrieveData);

export default class GoogleMaps extends Component {

  constructor(props) {
    super(props);
    this.state={
      defaultCenter: {lat: 21.5, lng: -158},
      defaultZoom: 10,
      lat: 0,
      lng: 0,
      trafficData: [],
      crimeData: []
    }
    this.geocoder=this.geocoder.bind(this);
  }

  geolocator(){
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState(
        {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      );
    });
  }

  trafficDataRequest(){
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", _ => {
      console.log(xhr.responseText);
      JSON.parse(xhr.responseText).data.forEach(trafficIncident => {
        retrieveData("http://localhost:8080/api/checkData")
          .then(trafficIncident => {
            console.log('ALOHA: ', trafficIncident);
          })
      })
    });
    xhr.open('GET', `https://data.honolulu.gov/api/views/qg2s-mjkr/rows.json`);
    xhr.send();
  }

  crimeDataRequest(){
   const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", _ =>
      this.setState({crimeData: JSON.parse(xhr.responseText)}));
    xhr.open('GET', `https://data.honolulu.gov/api/views/a96q-gyhq/rows.json`);
    xhr.send(); 
  }

  checkHighestRequest(){
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', _ => {

    });
    xhr.open('GET', 'http://localhost:8080/api/checkHighest');
    xhr.send();
  }

  cacheData(data){
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', _ => {
    });
    xhr.open('POST', 'http://localhost:4000/user/cache');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  }

  geocoder ({map, maps}) {
    var markers = [];
    var prevInfoWindow;
    let i = 0;
    let timer = setInterval(_ => {
      // console.log(this.state.crimeData);
      if (i >= this.state.trafficData.data.length){
        clearInterval(timer);
        console.log('GEOCODER FINISHED');
        return;
      }
      let trafficId = this.state.trafficData.data[i][0];
      let trafficDate = this.state.trafficData.data[i][8];
      let trafficAddress = this.state.trafficData.data[i][11];
      let trafficType = this.state.trafficData.data[i][10];
      function checkData(trafficId){
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', _ => {
          if(xhr.responseText === 'Traffic incident already exists'){
            console.log('DO SOMETHING TO SKIP GEOCODER');
          }else if(xhr.responseText === 'Traffic incident does not exist'){
            console.log('RUN GEOCODER');
          };
        xhr.open('GET', `http://localhost:4000/user/cache/${trafficId}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
        });
      };
      new maps.Geocoder().geocode({
        address: trafficAddress,
        componentRestrictions: {
          country: 'US',
          administrativeArea: 'Honolulu'
        }
      }, (results, status) => {
        if (status === 'OK'){
          let marker = new maps.Marker({
            map,
            position: results[0].geometry.location
          });
          markers.push(marker);
          console.log('Successfully geocoded', trafficAddress, 'at', 'LAT:', results[0].geometry.location.lat(), 'LNG:', results[0].geometry.location.lng());
          let infoWindow = new maps.InfoWindow({
            content: '<b>ID: </b>' + trafficId + '<br>' + '<b>Date & Time: </b>' + trafficDate + '<br>' + '<b>Address: </b>' + trafficAddress + '<br>' + '<b>Type: </b>' + trafficType
          });
          marker.addListener('click', _ => {
            if (prevInfoWindow){
              prevInfoWindow.close();
            }
            infoWindow.open(map, marker);
            prevInfoWindow = infoWindow;
          });
          this.cacheData({
            trafficId,
            trafficAddress,
            trafficDate,
            trafficType,
            latitude: results[0].geometry.location.lat(),
            longitude: results[0].geometry.location.lng()
          });
          console.log('Data cached');
          i++;
        }else if (status === 'OVER_QUERY_LIMIT'){
          console.log('Geocoding', trafficAddress, 'failed due to', status);
          return timer;
        }else{
          console.log('Geocoding failed due to', status);
        }
      });
    }, 1000)
  }

  componentWillMount(){
    this.geolocator();
    this.trafficDataRequest();
    this.crimeDataRequest();
  }

  render() {
    return (
      <GoogleMap
        onGoogleApiLoaded={this.geocoder}
        bootstrapURLKeys={{key: 'AIzaSyCC7M-pvWb75Zecv7358x-Zx9Bum_LPvGI'}}
        defaultCenter={this.state.defaultCenter}
        defaultZoom={this.state.defaultZoom}>
        <BlueDot
          lat={this.state.lat}
          lng={this.state.lng} />
        {
          mockData.features.map((mockIncident) => {
            return (
              <GreenMarker 
                key={mockIncident.properties.id}
                lat={mockIncident.geometry.coordinates[1]}
                lng={mockIncident.geometry.coordinates[0]} />
            );
          })
        }

      </GoogleMap>
    );
  }
}