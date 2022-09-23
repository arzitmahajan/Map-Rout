import React from 'react'
import "./Navbar.css";
export default function Navbar(props) {
  return (
    <div className='nav'>
        <img className = "logo" src = {props.logo} alt = "no img found"/>
    </div>
  )
}
