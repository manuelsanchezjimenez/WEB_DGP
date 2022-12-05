import axios from "axios"
import React, { Component } from "react"
// import ReactDOM from 'react-dom';
import { Redirect, Link } from 'react-router-dom'
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
         type: '1',
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
      let clearText = this.state.newDesrAct
      // clearText = clearText.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "");
      // clearText = this.clearDescripcion(clearText)
      let total = this.clearDescripcion()
      // this.setState({ newDesrAct: clearText })
      if (this.state.totalImages > 0 && total !== this.state.totalImages) {
         alert('El número de pasos descritos no coinciden con el total de imágenes introducidas\nPasos descritos: "' + total + '"\nNúmero de imáges: ' + this.state.totalImages);
         return false;
      }
      return true;
   }

   clearDescripcion() {
      let dirtyLinesText = this.state.newDesrAct.split('\n');
      let clearText = [""];
      for (let i = 0, x = 0; i < dirtyLinesText.length; i++) {
         if (dirtyLinesText[i].trim() !== "") {
            clearText[x] = dirtyLinesText[i].trim();
            x++;
         }
      }
      // clearText = clearText.join('\n');
      let string = clearText.join('\n');
      this.setState({ newDesrAct: string })
      return clearText.length;
   }
   handleSubmitData(event) {
      if (this.validate()) {
         alert('Nombre: "' + this.state.newNameAct + '", tipo: ' + this.state.type + '\nPasos: "' + this.state.newDesrAct + '"\n Pictogramas: ' + this.state.totalImages);
         var bodyFormData = new FormData();
         bodyFormData.append('nombre', this.state.newNameAct)
         bodyFormData.append('descripcion', this.state.newDesrAct)
         bodyFormData.append('enlaceVideo', this.state.enlaceVideo)
         bodyFormData.append('enlaceAudio', this.state.enlaceAudio)
         bodyFormData.append('type', this.state.type)
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
      }
      event.preventDefault();
      // this.handleSubmitImage(event);
   }

   // noImplementado
   handleSubmitImage(event) {
      // let correcto = true;
      for (let i = 0; i < this.state.totalImages; i++) {
         // alert('Guardando imagen: "' + this.state.image[i].value + '"\nDescripción: "' + this.state.newDesrAct + '"');
         var bodyFormData = new FormData();
         // bodyFormData.append('nombreAct', i + "::" + this.state.newNameAct)
         bodyFormData.append('actividad', this.state.newNameAct)
         bodyFormData.append('orden', i + "")
         bodyFormData.append('imagen', this.state.imagePath[i])
         axios({
            method: "post",
            url: `${SERVER_HOST}/actividades/imgAdd`,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
         }).catch(err => {
            //handle error
            alert('Error, no se ha podido guardar la imagen ' + i + ": " + this.state.newNameAc);
            // correcto = false;
            this.setState({ logInError: true, errorMessage: 'Error, no se ha podido guardar la actividad: ' + err })
         });
      }
      // if (correcto) {
      //    alert(" Imágenes guardadas ")
      //    this.setState({ redirectList: true })
      // }
      this.setState({ redirectList: true })
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
            <div className="contenedorPicto objectline" key="{i}_{this.state.imagePath[i]}" >
               {i + 1}
               <div className="contImage ">
                  <img className="imagen" id="target" src={this.state.image[i]} alt="Pictograma" />
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
            {this.state.redirectList ? <Redirect to="/ListaActividades" /> : null}
            <h1>Añadir nueva actividad</h1>
            <div className="both">
               <div className="formulario objectline parte">
                  <form onSubmit={this.handleSubmitData} >
                     <div>
                        <label>Nombre de la actividad:</label><br />
                        <input type="text" id="newNameAct" name="newNameAct" placeholder="Actividad a añadir" onChange={this.handleChange} className="inputLine" />
                     </div>
                     <div >
                        <label>Enlace a un vídeo: (opcional)</label><br />
                        <input type="text" id="enlaceVideo" name="enlaceVideo" placeholder="http://..." onChange={this.handleChange} className="inputLine" />
                     </div>
                     <div>
                        <label>Enlace a un audio: (opcional)</label><br />
                        <input type="text" id="enlaceAudio" name="enlaceAudio" placeholder="http://..." onChange={this.handleChange} className="inputLine" />
                     </div>
                     <div>
                        <label>Tipo de actividad:</label>
                        <strong>
                           <a className="vote-up-off"
                              title="Según el tipo, al alumno se le dispondrá lo siguiente:&#10;- Descripción: Un texto con la descripción indicada&#10;- Pasos a segir: Las indicaciones de cada paso a realizar uno a uno&#10;- Contadores: Un contador con cada elemento&#10;- Tareas: Un checkbox donde podrá marcar o no cada tarea"> (?)</a>
                        </strong>
                        <select className="form-control" name="type" defaultValue="1" onChange={this.handleChange}>
                           <option value="0">Descripción</option>
                           <option value="1">Pasos a realizar</option>
                           <option value="2">Contador</option>
                           <option value="3">Tareas a realizar</option>
                        </select>
                     </div>

                     <div>
                        {
                           {
                              '0':
                              <label>Descripción:
                              </label>
                              , '1':
                              <label>Pasos a seguir:
                                 <strong><a className="vote-up-off" title="Describa los pasos a seguir de cada pictograma&#10;separados por un 'enter' o salto de línea cada uno"> (?)</a></strong>
                              </label>
                              , '2':
                              <label>Elementos con contador:
                                 <strong><a className="vote-up-off" title="Describa los distintos elementos con contador&#10;separados por un 'enter' o salto de línea cada uno"> (?)</a></strong>
                              </label>
                              , '3':
                              <label>Tareas:
                                 <strong><a className="vote-up-off" title="Describa las distintas tareas que tiene cada checkbox&#10;separados por un 'enter' o salto de línea cada uno"> (?)</a></strong>
                              </label>
                           }[this.state.type]
                        }
                        {/* <strong><a className="vote-up-off" title="Describa los pasos a seguir de cada pictograma&#10;separados por un 'enter' o salto de línea cada uno"> (?)</a></strong> */}
                        <br />
                        <textarea id="newDesrAct" name="newDesrAct" onChange={this.handleChange} className="inputLine"
                           // {this.state.type ===1?  ('placeholder="Descripción de pictograma nº 1...&#10;Descripción de pictograma nº 2...&#10;Descripción de pictograma nº 3..."'); ('placeholder="Doesrefsef.'")}
                           placeholder="Descripción nº 1...&#10;Descripción nº 2...&#10;Descripción nº 3..."
                        />

                     </div>

                  </form>
               </div>
               <div className="objectline secuenciaPicto parte">
                  <div className="cuadroPictos">

                     <h2>Secuencia de pictogramas</h2>
                     <div className="scroll">
                        {this.state.totalImages ? null : <div>Esta actividad no tiene ningún pictograma</div>}

                        {this.listaImages()}
                     </div>
                  </div>
                  Seleccionar pictogramas: (opcional)
                  {/* <br></br> */}

                  <input type="file" title="Seleccionar imagen " onChange={this.handleFileChange} />
               </div>
            </div>
            <div className="parteBotonesh">
               <button className="botonAcciones verde" onClick={this.handleSubmitData}>
                  Añadir Actividad
               </button>
               <Link to="/ListaActividades"><input id="volverActividades" type="button" className="botonAcciones rojo" value="Cancelar" /></Link>
            </div>
         </div>
      );
   }
}
