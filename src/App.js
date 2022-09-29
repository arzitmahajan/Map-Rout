import './App.css';
import Navbar from './Components/Navbar';
import Map from './Components/Map';
import logo from './Assets/logo.png';
import mark from './Assets/placeholder.png';
import cross from './Assets/cross.png';
import currentIcon from './Assets/recentre.png';
import add from './Assets/add.png';
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
    const waypoints = [{}];
    const finalDestination = inputList[0][""];
    for (let i = 1; i < inputList.length; i++) { 
      const temp = {location: "", stopover: false};
        temp.location = inputList[i][""];
        temp.stopover = true;
        waypoints.push(temp);
    }
    waypoints.shift();
    //console.log(typeof originRef.current.value);
    //console.log(waypoints);
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return alert("Enter origin and destination");
    }
    const directionService = new google.maps.DirectionsService();

    let result;
    if (waypoints.length >= 1) {
        result = await directionService.route({
        origin: originRef.current.value,
        destination: finalDestination,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING
      })
    }
    else {
      result = await directionService.route({
        origin: originRef.current.value,
        destination: finalDestination,
        travelMode: google.maps.TravelMode.DRIVING
      })
    }

    var totalDist = 0;
    var totalTime = 0;
    var myroute = result.routes[0];
    for (let i = 0; i < myroute.legs.length; i++) {
      totalDist += myroute.legs[i].distance.value;
      totalTime += myroute.legs[i].duration.value;
    }
    totalDist = (totalDist / 1000).toFixed(2)
    totalTime = (totalTime / 3600).toFixed(2)
    setResponse(result);
    setDistance(totalDist);
    setDuration(totalTime);

    let origin = originRef.current.value.split(',');
    setOriginInput(origin[0]);
    let distance = finalDestination.split(",");
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


  //add input
  const [inputList, setInputList] = useState([{point:""}]);

  // handle input change
  const handleInputChange = (e, index) => {    
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = index => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);

  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { point: "" }]);
  };
  
  if (!isLoaded) return <div>Loading...</div>
  return (
    <>
      <Navbar logo={logo} />
      <center><p className='texto'>Let's calculate <strong>distance</strong> from Google maps</p></center>
      <div className='main d-flex'>
        <div className='input-form'>
          <div>
            <label htmlFor="origin" className='label'><span className='label'>Origin</span></label>
            <input type="image" className='current' src={currentIcon} onClick={() => map.panTo(centerGiven)} alt="not found" />
            <input type="image" className="current mx-4" src={cross} onClick={clearRoute} alt="not found" />
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
            <label htmlFor="destination"><span className='label'>Destination</span></label></div>
          {inputList.map((x, i) => {
            return (
              <div className="normal" key={i}>
                {
                  <>
                    {i!==0&&<label htmlFor="destination"><span className='label'>Waypoint</span></label>}
                    <div className="input-bg col-sm-5 d-flex">
                      <img className='holder' src={mark} alt="not found" />
                      <Autocomplete>
                        <input  className={`way yo${i}`} ref={destinationRef} onBlur={e => handleInputChange(e, i)} />
                      </Autocomplete>
                    </div>
                  </>
                }
                <div className="wayinput-bg">
                  {inputList.length===1?"": inputList.length-1===i && <button
                      className="addButton" 
                      onClick={() => handleRemoveClick(i)}><img className="add" src={cross} alt="not found"/></button>}
                  {inputList.length - 1 === i && <button className="addButton" onClick={handleAddClick}><img className="add" src={add} alt="not found"/></button>}
                </div>
              </div>
            );
          })}



          <div className="res-section">
            <div className='result d-flex'>
              <div className='head'><span className='distDeco'>Distance</span></div>
              <div className='tail'><span className='dist'>{`${distance} km`}</span></div>
            </div>
            <div className='liner'>
              {originInput && <span className='duration'><p>The distance between <strong>{originInput}</strong> and <strong>{destinationInput}</strong> is <strong>{`${distance} km `}</strong>and estimated time is <strong>{`${duration} hr`}</strong></p></span>}
            </div>
          </div>
        </div>
        <Map response={response} center={centerGiven} setRecenter={recenter} />
      </div>
    </>
  );
}
export default App;

