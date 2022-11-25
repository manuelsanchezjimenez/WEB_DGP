import axios from "axios"
import React, { Component } from "react"
import { SERVER_HOST } from "../config/global_constants"
import { GrLogout } from "@react-icons/all-files/gr/GrLogout";
import { FaRegUserCircle } from "@react-icons/all-files/fa/FaRegUserCircle";
import "../css/Header.css"
import LogOut from "./LogOut"
import HomeAdmin from "./HomeAdmin";
import { Redirect, Link } from 'react-router-dom';
import { ACCESS_LEVEL_TEACHER,ACCESS_LEVEL_ADMIN} from "../config/global_constants"


export default class Header extends Component {
   constructor() {
      super();
      this.state = { checked: false,
                     redirect: 'HomeAdmin'
      };
      this.handleChange = this.handleChange.bind(this);

   }

   /* componentDidMount(){
      if(localStorage.accessLevel === ACCESS_LEVEL_ADMIN){
         this.setState({redirect: 'HomeAdmin'})
     }else{
         this.setState({redirect: 'HomeTeacher'})
     }
   } */

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
               <Link to="/LogOut"><span className="box Menu"><GrLogout /></span></Link>
               {/* <Link to={`${this.state.redirect}`}><img className="logo" src={require("../images/logo.png")} alt="Logo San Rafael" /></Link> */}
               <Link to="/HomeAdmin"><img className="logo" src={require("../images/logo.png")} alt="Logo San Rafael" /></Link>
               <span className="box Persona"><FaRegUserCircle /></span>
            </div>
      );
   }


}