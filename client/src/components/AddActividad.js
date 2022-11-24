import axios from "axios"
import React, { Component } from "react"
// import ReactDOM from 'react-dom';
import {Redirect, Link} from 'react-router-dom'
// import { Link } from 'react-router-dom'
// import { useState } from 'react';
import Header from "./Header"
import { SERVER_HOST } from "../config/global_constants"
import "../css/AddActividad.css"

export default class AddActividad extends Component {
   constructor(props) {
      super(props);

      this.state = {
         newNameAct: '',
         newDesrAct: '',
         enlaceVideo: '',
         enlaceAudio: '',
         image: [],
         imagePath: [],
         totalImages: 0,
         redirectList: false,
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
         bodyFormData.append('enlaceVideo', this.state.enlaceVideo)
         bodyFormData.append('enlaceAudio', this.state.enlaceAudio)
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
      // this.handleSubmitImage(event);
   }

   // noImplementado
   handleSubmitImage(event) {
      let correcto = true;
      for (let i = 0; i < this.state.totalImages; i++) {
         // alert('Guardando imagen: "' + this.state.image[i].value + '"\nDescripción: "' + this.state.newDesrAct + '"');
         var bodyFormData = new FormData();
         bodyFormData.append('nombreAct', i + "::" + this.state.newNameAct)
         bodyFormData.append('imagen', this.state.imagePath[i])
         axios({
            method: "post",
            url: `${SERVER_HOST}/actividades/imgAdd`,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
         }).catch(err => {
            //handle error
            alert('No se ha podido guardar las imágenes');
            correcto = false;
            this.setState({ logInError: true, errorMessage: 'Error, no se ha podido guardar la actividad: ' + err })
         });
      }
      if (correcto) {
         alert("Imágenes guardadas correctamente")
         this.setState({redirectList: true})
      }
   }

   handleFileChange = (event) => {
      if (event.target.files) {
         let reader = new FileReader();
         reader.onload = (e) => {
            // Metodo 1: No se  modifica directamente this.state pero slice es un método poco fiable (pueden mutar los datos)
            let copyImage = this.state.image.slice();
            copyImage.push(e.target.result);
            // copyImagePath = this.state.imagePath.slice();
            // copyImagePath.push(e.target.files);
            this.setState({ image: copyImage }); //, imagePath : copyImagePath });
            // Metodo 2: Se modifica directamente this.state pero los datos se modifican de manera más segura
            // this.state.image.push(e.target.result);
            // this.state.imagePath.push(e.target.files);

            this.setState({ totalImages: this.state.totalImages + 1 });
         };
         let copyImagePath = this.state.imagePath.slice();
         copyImagePath.push(event.target.files[0].name);
         reader.readAsDataURL(event.target.files[0]);
         event.target.value = null;
         this.setState({ imagePath: copyImagePath });
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
      return pictos;
   }

   moveImage(item, move) {
      // alert('Se quiere mover la imagen ' + item + ' en la posición ' + move)
      // Metodo 1: No se modifica directamente this.state pero slice es un método poco fiable (pueden mutar los datos)
      let k, copyImage = this.state.image.slice();
      k = copyImage[item];
      copyImage[item] = copyImage[move]
      copyImage[move] = k;
      let copyImagePath = this.state.imagePath.slice();
      k = copyImagePath[item];
      copyImagePath[item] = copyImagePath[move]
      copyImagePath[move] = k;
      this.setState({ image: copyImage, imagePath: copyImagePath });
      // Metodo 2: Se modifica directamente this.state pero los datos se modifican de manera más segura
      // let k;
      // k = this.state.image[item];
      // this.state.image[item] = this.state.image[move]
      // this.state.image[move] = k;
      // k = this.state.imagePath[item];
      // this.state.imagePath[item] = this.state.imagePath[move]
      // this.state.imagePath[move] = k;
      // this.setState({ totalImages: this.state.totalImages  });
   }

   deleteImage(item) {
      // alert('Se quiere eliminar la imagen ' + item)
      // Metodo 1: No se modifica directamente this.state pero slice es un método poco fiable (pueden mutar los datos)
      let copyImage = this.state.image.slice(), copyImagePath = this.state.imagePath.slice();
      copyImage.splice(item, 1);
      copyImagePath.splice(item, 1);
      this.setState({ image: copyImage, imagePath: copyImagePath });
      // this.setState({ totalImages: this.state.totalImages-1 });
      // Metodo 2: Se modifica directamente this.state pero los datos se modifican de manera más segura
      // this.state.image.splice(item, 1);
      // this.state.imagePath.splice(item, 1);

      this.setState({ totalImages: this.state.totalImages - 1 });
   }

   render() {
      return (
         <div className="web-container">
            <Header />
            {this.state.redirectList ? <Redirect to="/ListaActividades"/> : null}

            <h1>Añadir nueva actividad</h1>
            <div className="formulario">
               <form onSubmit={this.handleSubmitData}>
                  <div>
                     <label>Nombre de la actividad:</label><br />
                     <input type="text" id="newNameAct" name="newNameAct" placeholder="Nombre de la nueva actividad" onChange={this.handleChange} />
                  </div>
                  <div>
                     <label>Tipo de la actividad:</label><br />
                     <input type="text" id="newTypeAct" name="newTypeAct" placeholder="Tipo de la nueva actividad" onChange={this.handleChange} />
                  </div>
                  <div>
                     <label>Descripción:</label><br />
                     <textarea type="text" id="newDesrAct" name="newDesrAct" placeholder="Descripción de la nueva actividad" onChange={this.handleChange} />
                  </div>
                  
                  <div>
                     <label>Enlace a un vídeo:</label><br />
                     <input type="text" id="enlaceVideo" name="enlaceVideo" placeholder="Enlace a un vídeo" onChange={this.handleChange} />
                  </div>
                  <div>
                     <label>Enlace a un audio:</label><br />
                     <input type="text" id="enlaceAudio" name="enlaceAudio" placeholder="Enlace a un audio" onChange={this.handleChange} />
                  </div>
               </form>
               <div className="buttonContainer">
                  <Link to="/ListaActividades"><input id="toggleActividades" type="button" value="CANCELAR" /></Link>
               </div>
            </div>
            <div id="secuenciaPicto">
               <h2>Secuencia de pictogramas</h2>
               <div id="ContenedorImagenes">
                  {this.listaImages()}
               </div>
               <input type="file" onChange={this.handleFileChange} />
               <div className="buttonContainer">
                  <button className="buttonAñadir" onClick={this.handleSubmitData}>
                     Añadir Actividad
                  </button>
               </div>
            </div>
         </div>
      );
   }
}
