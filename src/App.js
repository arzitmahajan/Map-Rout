import './App.css';
import Navbar from './Components/Navbar';
import Map from './Components/Map';
import logo from './Assets/logo.png';
import mark from './Assets/placeholder.png';
import currentIcon from './Assets/location.png';
import React, {useState, useRef, useEffect } from 'react';
import { useJsApiLoader, Autocomplete} from "@react-google-maps/api";

function App() {
  const [map, setmap] = useState(/** @type google.maps.Map */(null));
  const [response, setResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [originInput, setOriginInput] = useState(false)
  const [destinationInput, setDestinationInput] = useState(false)
  const [centerGiven, setcenterGiven] = useState({  lng: '',lat: '' })

  const originRef = useRef();
  const destinationRef = useRef();

  const google = window.google;

  //Load API key and libraries
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:process.env.REACT_APP_NEXT_API_KEY,
    libraries: ['places'],
  });
  //fetch current coordinates of user and if access is handling it 
  useEffect(() => {
    const getCoordinates = (position) => {
      setcenterGiven({lng: position.coords.longitude, lat: position.coords.latitude });
    }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCoordinates,showError);
      }
      else {
        alert("Geolocation is not supported by this browser");
      }
      function showError(error) {
        switch(error.code) {
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
      <center><p className='texto my-3'>Let's calculate <strong>distance</strong> from Google maps</p></center>
      <div className='container d-flex justify-content-between my-5'>
        <div className='input-form'>
          <div className="mb-3">
            <label htmlFor="origin" className='label'><span className='label'>Origin</span></label>
            <button className='current' onClick={()=>map.panTo(centerGiven)}><img className='currimg' src={currentIcon} alt="not found"/></button>
            <div className="input-bg col-sm-5 d-flex">
              <img className='holder mx-3' src={mark} alt="not found" />
              <Autocomplete>
                <input type="text" className="origin my-3 mx-2" ref={originRef} />
              </Autocomplete>
            </div>
          </div>
          <div className="mb-3 d-flex align-items-end flex-column">
            <button type="button" className="mt-auto p-2 cal-button" onClick={calculateDistance}>Calculate</button>
          </div>
          <div className="mb-3">
            <label htmlFor="destination"><span className='label'>Destination</span></label>
            <div className="input-bg col-sm-5 d-flex">
              <img className='holder mx-3' src={mark} alt="not found" />
              <Autocomplete>
                <input type="text" className="destination my-3 mx-2" ref={destinationRef} />
              </Autocomplete>
            </div>
          </div>
          <div className='res'>
            <div className="mb-3 d-flex align-items-end flex-column">
              <button type="button" className="mt-auto p-2 my-4 clr-button" onClick={clearRoute}>Clear</button>
            </div>
            <div className='result row rounded'>
              <div className='head col-2  justify-content-center  d-flex align-items-center'><span className='distDeco'>Distance</span></div>
              <div className='head col-2  justify-content-center  d-flex align-items-center'><span className='dist'>{distance}</span></div>
            </div>

            <div className='liner my-5'>
              {originInput && <span className='duration'><p>The dist btw <strong>{originInput}</strong> and <strong>{destinationInput}</strong> is <strong>{distance}</strong>and estimated time is <strong>{duration}</strong></p></span>}
            </div>
          </div>
        </div>
        <Map response={response} center={centerGiven} setRecenter={recenter} />
      </div>
    </>
  );
}
export default App;

