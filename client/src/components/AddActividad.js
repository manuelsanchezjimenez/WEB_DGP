import axios from "axios"
import React, { Component } from "react"
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom'
import { useState } from 'react';
import Header from "./Header"
import { SERVER_HOST } from "../config/global_constants"
import "../css/AddActividad.css"

export default class AddActividad extends Component {
   constructor(props) {
      super(props);

      this.state = {
         newNameAct: '',
         newDesrAct: '',
         image: [],
         totalImages: 0,
      };
      this.listaImages = this.listaImages.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmitData = this.handleSubmitData.bind(this);
      this.handleSubmitImage = this.handleSubmitImage.bind(this);
      this.deleteImage = this.deleteImage.bind(this);
   }

   handleChange(event) {
      this.setState({ [event.target.name]: event.target.value.trim() });
   }

   validate() {
      if (this.state.newNameAct === '' || this.state.newDesrAct === '') {
         alert(' Los campos de nombre y descripción no pueden estar vacíos');
         return false;
      }
      return true;
   }

   handleSubmitData(event) {
      if (this.validate()) {
         alert('Nombre: "' + this.state.newNameAct + '"\nDescripción: "' + this.state.newDesrAct + '"');
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
            alert('Actividad añadida, se van a guardar las imágenes...');
            this.handleSubmitImage(event);
         }).catch(err => {
            //handle error
            alert('No se ha podido guardar la actividad');
            this.setState({ logInError: true, errorMessage: 'Error, no se ha podido guardar la actividad.' })
         });
         event.preventDefault();
      }
   }

   handleSubmitImage(event) {
      var totalImages = 3
      for (let i = 0; i < totalImages; i++) {
         alert('Guardando imagen: "' + this.state.image[i].value + '"\nDescripción: "' + this.state.newDesrAct + '"');
         var bodyFormData = new FormData();
         bodyFormData.append('nombre', i)
         bodyFormData.append('imagen', this.state.image[i])
         axios({
            method: "post",
            url: `${SERVER_HOST}/actividades/add`,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
         }).then(res => {
            //handle success
            alert('Imágenes añadidas, se van a guardar las imágenes...');
            this.handleSubmitImage(event);
         }).catch(err => {
            //handle error
            alert('No se ha podido guardar las imágenes');
            this.setState({ logInError: true, errorMessage: 'Error, no se ha podido guardar la actividad.' })
         });
         event.preventDefault();
      }
   }

   handleFileChange = (event) => {
      if (event.target.files) {
         let reader = new FileReader();
         reader.onload = (e) => {
            // Metodo 1: No se  modifica directamente this.state pero slice es un método poco fiable (pueden mutar los datos)
            let copyImage = this.state.image.slice();
            copyImage[this.state.totalImages] = e.target.result;
            this.setState({ image: copyImage });
            // Metodo 2: Se modifica directamente this.state pero los datos se modifican de manera más segura
            // this.state.image[this.state.totalImages] = e.target.result;

            this.setState({ totalImages: this.state.totalImages + 1 });
         };
         reader.readAsDataURL(event.target.files[0]);
         event.target.value = null;
      }
   }

   listaImages() {
      const pictos = [];
      for (let i = 0; i < this.state.totalImages; i++) {
         pictos.push(
            <div className="contenedorPicto objectLine" key="{i}" >
               {i + 1}
               <div className="contImage ">
                  <img className="imagen" id="target" src={this.state.image[i]} />
               </div>
               <span>
                  <button className="boton b1" onClick={() => { this.moveImage(i, (i - 1 + this.state.totalImages) % this.state.totalImages) }}>
                     <span>&#8592;</span>
                  </button>
                  <button className="boton b1" onClick={() => { this.deleteImage(i) }}>
                     <span>&#128465;</span>
                  </button>
                  <button className="boton b1" onClick={() => { this.moveImage(i, (i + 1) % this.state.totalImages) }}>
                     <span>&#8594;</span>
                  </button>
               </span>
            </div>
         );
      }
      // this.state.insertImageMode = false;
      return pictos;
   }

   moveImage(item, move) {
      // alert('Se quiere mover la imagen ' + item + ' en la posición ' + move)
      // Metodo 1: No se modifica directamente this.state pero slice es un método poco fiable (pueden mutar los datos)
      let k, copyImage = this.state.image.slice();
      k = copyImage[item];
      copyImage[item] = copyImage[move]
      copyImage[move] = k;
      this.setState({ image: copyImage });
      // Metodo 2: Se modifica directamente this.state pero los datos se modifican de manera más segura
      // let k;
      // k = this.state.image[item];
      // this.state.image[item] = this.state.image[move]
      // this.state.image[move] = k;
      // this.setState({ totalImages: this.state.totalImages  });
   }

   deleteImage(item) {
      // alert('Se quiere eliminar la imagen ' + item)
      // Metodo 1: No se modifica directamente this.state pero slice es un método poco fiable (pueden mutar los datos)
      this.setState({ totalImages: this.state.totalImages - 1 });
      let copyImage = this.state.image.slice();
      copyImage.splice(item, 1);
      this.setState({ image: copyImage });
      // this.setState({ totalImages: this.state.totalImages-1 });
      // Metodo 2: Se modifica directamente this.state pero los datos se modifican de manera más segura
      // this.state.image.splice(item, 1);
   }

   render() {
      return (
         <div className="web-container">
            <Header />
            <h1>Añadir nueva actividad</h1>
            <div className="formulario">
               <form onSubmit={this.handleSubmitData}>
                  <div>
                     <label>Nombre de la tarea:</label><br />
                     <input type="text" id="newNameAct" name="newNameAct" placeholder="Nombre de la nueva actividad" onChange={this.handleChange} />
                  </div>
                  <div>
                     <label>Descripción:</label><br />
                     <textarea id="newDesrAct" name="newDesrAct" placeholder="Descripción de la nueva actividad" onChange={this.handleChange} />
                  </div>
               </form>
               <div>
                  <h2>Secuencia de pictogramas</h2>
                  <div id="ContenedorImagenes">
                     {this.listaImages()}
                  </div>
                  <input type="file" onChange={this.handleFileChange} />
               </div>
               <button className="boton b1" onClick={this.handleSubmitData}>
                  Añadir
               </button>
            </div>
            <Link to="/ListaActividades"><input id="toggleActividades" type="button" value="CANCELAR" /></Link>
         </div>
      );
   }
}
