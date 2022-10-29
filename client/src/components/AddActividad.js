import axios from "axios"
import React, { Component } from "react"
import { Link } from 'react-router-dom'
import { useState } from 'react';
import Header from "./Header"
import { SERVER_HOST } from "../config/global_constants"
import "../css/AddActividad.css"

export default class AddActividad extends Component {
   constructor(props) {
      super(props);

      this.state = {
         // error: null,
         // mounted: false,
         // alumnos: [],
         newNameAct: '',
         newDesrAct: '',
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
   }

   handleChange(event) {
      // this.setState({ value: event.target.value });
      this.setState({ [event.target.name]: event.target.value.trim() });
   }

   handleSubmit(event) {

      alert('Nombre: "' + this.state.newNameAct + '"\nDescripción: "' + this.state.newDesrAct+'"');
      var bodyFormData = new FormData();
      bodyFormData.append('nombre', this.state.newNameAct)
      bodyFormData.append('descripcion', this.state.newDesrAct)      
      
      axios({
         method: "post",
         url: `${SERVER_HOST}/actividades/add`,
         data: bodyFormData,
         headers: { "Content-Type": "multipart/form-data" },
     }).then(res => {
         //handle success
      alert(' ¡Hecho! ');
      // location.replace('localhost:3000/ListaActividades');

         // localStorage.usuario = res.data.usuario
         // localStorage.accessLevel = res.data.accessLevel
         // localStorage.token = res.data.token

         // if(res.data.accessLevel === ACCESS_LEVEL_ADMIN){
         //     this.setState({redirectAdmin:true})
         // }else{
         //     this.setState({redirectTeacher:true})
         // }
     }).catch(err => {
         //handle error
      alert(' Vaya, parece que algo ha ido mal ');
         this.setState({logInError: true, errorMessage: 'Error, no se ha podido guardar la actividad.'})
     });

      event.preventDefault();
   }

   render() {
      return (
         <div className="web-container">
            <Header />
            Añadir nueva actividad
            <div className="formulario">
               <form onSubmit={this.handleSubmit}>
                  <div>
                     <label>Nombre de la tarea:</label><br />
                     <input type="text" id="newNameAct" name="newNameAct" placeholder="Nombre de la nueva actividad" onChange={this.handleChange} />
                  </div>
                  <div>
                     <label>Descripción:</label><br />
                     <textarea id="newDesrAct" name="newDesrAct" placeholder="Descripción de la nueva actividad" onChange={this.handleChange} />
                  </div>
                  <div>
                     Secuencia de pictogramas
                  </div>
                  <button className="boton b1" type="submit">
                     Añadir
                  </button>
               </form>
            </div>
         </div>
      );
   }
}