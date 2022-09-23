import { DirectionsRenderer, GoogleMap, MarkerF } from '@react-google-maps/api';
import React from 'react';
import './Map.css';

const Map = (props) => {
    function recentering(e){
        props.setRecenter(e);
      }
    return (
            <GoogleMap
                zoom={10}
                center={props.center}
                mapContainerClassName="map-container"
                mapContainerStyle={{width:"42%"}}
                onLoad={recentering}
            >
                {props.response&&<DirectionsRenderer directions={props.response}/>}
                <MarkerF position={props.center} />
            </GoogleMap>
    )
}

export default Map;