import { DirectionsRenderer, GoogleMap, MarkerF } from '@react-google-maps/api';
import React from 'react';

const Map = (props) => {
    function recentering(e){
        props.setRecenter(e);
      }
      const mapContainerStyle = {
            width: "560px",
            height: "511px",
            margin:"0px 104px 120px 130px",
    };
    return (
            <GoogleMap
                zoom={10}
                center={props.center}
                mapContainerClassName="map-container"
                mapContainerStyle={mapContainerStyle}
                onLoad={recentering}
            >
                {props.response&&<DirectionsRenderer directions={props.response}/>}
                <MarkerF position={props.center} />
            </GoogleMap>
    )
}

export default Map;