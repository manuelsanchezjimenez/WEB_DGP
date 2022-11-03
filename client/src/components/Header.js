import axios from "axios"
import React, { Component } from "react"
import { Link } from 'react-router-dom'
import { SERVER_HOST } from "../config/global_constants"
import { GrLogout } from "@react-icons/all-files/gr/GrLogout";
import { FaRegUserCircle } from "@react-icons/all-files/fa/FaRegUserCircle";
import "../css/Header.css"

export default class Header extends Component {
   constructor() {
      super();
      this.state = { checked: false };
      this.handleChange = this.handleChange.bind(this);

   }
   handleChange(checked) {
      this.setState({ checked });
   }
   openNav() {
      document.getElementById("sideNavigation").style.width = "250px";
      document.getElementById("main").style.marginLeft = "250px";
  }
   
  closeNav() {
      document.getElementById("sideNavigation").style.width = "0";
      document.getElementById("main").style.marginLeft = "0";
  }

   render() {
      return (
        
        <div className="Header">
               <span className="box Menu"><GrLogout /></span>
               <img className="logo" src={require("../images/logo.png")} alt="Logo San Rafael" />
               <span className="box Persona"><FaRegUserCircle /></span>
            </div>
      );
   }


}