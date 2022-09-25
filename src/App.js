import './App.css';
import Navbar from './Components/Navbar';
import Map from './Components/Map';
import logo from './Assets/logo.png';
import mark from './Assets/placeholder.png';
import cross from './Assets/cross.png';
import currentIcon from './Assets/recentre.png';
import React, { useState, useRef, useEffect } from 'react';
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

function App() {
  const [map, setmap] = useState(/** @type google.maps.Map */(null));
  const [response, setResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [originInput, setOriginInput] = useState(false)
  const [destinationInput, setDestinationInput] = useState(false)
  const [centerGiven, setcenterGiven] = useState({ lng: '', lat: '' })

  const originRef = useRef();
  const destinationRef = useRef();

  const google = window.google;

  //Load API key and libraries
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_NEXT_API_KEY,
    libraries: ['places'],
  });
  //fetch current coordinates of user and if access is handling it 
  useEffect(() => {
    const getCoordinates = (position) => {
      setcenterGiven({ lng: position.coords.longitude, lat: position.coords.latitude });
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCoordinates, showError);
    }
    else {
      alert("Geolocation is not supported by this browser");
    }
    function showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("User denied the request for Geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          alert("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          alert("An unknown error occurred.");
          break;
        default:
          break;
      }
    }

  }, []);


  //calculate route distance and duration
  const calculateDistance = async () => {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return alert("Enter origin and destination");
    }
    const directionService = new google.maps.DirectionsService();
    const result = await directionService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING
    })
    setResponse(result);
    setDistance(result.routes[0].legs[0].distance.text);
    setDuration(result.routes[0].legs[0].duration.text);

    let origin = originRef.current.value.split(',');
    setOriginInput(origin[0]);
    let distance = destinationRef.current.value.split(',');
    setDestinationInput(distance[0]);
  }

  //calculate route distance and duration
  const clearRoute = () => {

    setDistance('');
    setDuration('');
    originRef.current.value = "";
    destinationRef.current.value = "";
    setOriginInput(false);
    setDestinationInput(false);
  }

  //recenter the map to current user coordinates
  function recenter(e) {
    setmap(e);
  }

  if (!isLoaded) return <div>Loading...</div>
  return (
    <>
      <Navbar logo={logo} />
      <center><p className='texto'>Let's calculate <strong>distance</strong> from Google maps</p></center>
      <div className='main d-flex'>
        <div className='input-form'>
          <div>
            <label htmlFor="origin" className='label'><span className='label'>Origin</span></label>
            <input type="image" className='current' src={currentIcon} onClick={() => map.panTo(centerGiven)}/>
            <input type="image" className="current mx-4"  src={cross} onClick={clearRoute}/>
            <div className="input-bg col-sm-5 d-flex">
              <img className='holder' src={mark} alt="not found" />
              <Autocomplete>
                <input type="text" className="origin" ref={originRef} />
              </Autocomplete>
            </div>
          </div>
          <div>
            <button type="button" className="cal-button" onClick={calculateDistance}>Calculate</button>
          </div>
          <div className="mo">
            <label htmlFor="destination"><span className='label'>Destination</span></label>
            <div className="input-bg col-sm-5 d-flex">
              <img className='holder' src={mark} alt="not found" />
              <Autocomplete>
                <input type="text" className="origin" ref={destinationRef} />
              </Autocomplete>
            </div>
          </div>
          <div className="res-section">
            <div className='result d-flex'>
              <div className='head'><span className='distDeco'>Distance</span></div>
              <div className='tail'><span className='dist'>{distance}</span></div>
            </div>
            <div className='liner'>
              {originInput && <span className='duration'><p>The distance between <strong>{originInput}</strong> and <strong>{destinationInput}</strong> is <strong>{distance}</strong>and estimated time is <strong>{duration}</strong></p></span>}
            </div>
          </div>
        </div>
        <Map response={response} center={centerGiven} setRecenter={recenter} />
      </div>
    </>
  );
}
export default App;

