import axios from "axios"
import React, { Component } from "react"
// import ReactDOM from 'react-dom';
import { Redirect, Link } from 'react-router-dom'
// import { useState } from 'react';
import Header from "./Header"
import { SERVER_HOST } from "../config/global_constants"
import "../css/AddTareaAct.css"

const AlumnRow = ({ nombre, select }) => {
   return (
      <tr className="allWidth" >
         <td className="" >{`${nombre}`}</td>
         <td className="anchoCeldaSelectList" >
            {/* <input type="radio" value={`${select}`} name="selectAct" /> */}
            {select}
         </td>
      </tr>
   )
}

export default class AddTarea extends Component {
   constructor(props) {
      super(props);
      this.state = {
         errorAlumn: null,
         mountedAlumn: false,
         selectAlum: "",
         checkAlum: false,
         orderAlumn: "none",
         alumnos: [],
         muestraAlumnos: [],
         newNameTar: '',
         newDescrTar: '',
         enlaceVideo: '',
         enlaceAudio: '',
         type: '1',
         image: [],
         imagePath: [],
         totalImages: 0,
         redirectList: false,
      };
      this.showTableAlumn = this.showTableAlumn.bind(this);
      this.sortResultsAlumn = this.sortResultsAlumn.bind(this);
      this.listaImages = this.listaImages.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.validate = this.validate.bind(this);
      this.handleSubmitData = this.handleSubmitData.bind(this);
      this.handleSubmitImage = this.handleSubmitImage.bind(this);
      this.deleteImage = this.deleteImage.bind(this);
      this.toggleAlum = this.toggleAlum.bind(this);
      this.quitAlumn = this.quitAlumn.bind(this);
   }

   componentDidMount() {
      axios.get(
         `${SERVER_HOST}/Users/student`,
         { headers: { "Content-type": "multipart/form-data" } })
         .then(res => {
            if (res.data) {
               if (res.data.errorMessage) {
                  alert("No se han podido tomar los datos " + res.data.errorMessage);
                  console.log(res.data.errorMessage)
                  this.setState({ errorAlumn: res.data.errorMessage });
               } else {
                  let getData = JSON.parse(JSON.stringify(res.data).toString());
                  let saveData = [];
                  for (let i = 0; i < getData.length; i++) {
                     saveData.push({ nombre: getData[i].nombre, Usuario: getData[i].usuario, key: getData[i]._id });
                  }
                  // this.setState({ actividades: tableData, muestraAlumnos: tableData, mounted: true });
                  this.setState({ alumnos: saveData, muestraAlumnos: saveData, mountedAlumn: true });
                  // console.log(this.state.alumnos[0]);
               }
            } else {
               this.setState({ errorAlumn: "No se han encontrado alumnos" });
               console.log("No se han encontrado alumnos")
            }
         })
   }

   toggleAlum(alum) {
      if (!this.state.checkAlum) {
         this.setState(prevStateAlumn => ({
            muestraAlumnos:
               // destacAlum[0].length > 0
               this.filterResultsAlumn(alum, prevStateAlumn.alumnos)
            // : prevStateAlumn.alumnos
         }));
         this.setState({ checkAlum: true })
      }
      else
         this.quitAlumn(alum)
   };
   quitAlumn(alum) {
      if (this.state.checkAlum) {
         this.setState({
            checkAlum: false,
            selectAlum: ""
         })
         this.setState(prevStateAlumn => ({
            muestraAlumnos: this.state.alumnos
         }));
      }
   }
   filterResultsAlumn = (query, results) => {
      return results.filter(alumno => {
         const name = alumno.nombre.toLowerCase();
         return name.includes(query.toLowerCase());
      });
   };
   sortResultsAlumn = event => {
      this.setState(prevStateAlumn => {
         const { muestraAlumnos, sortOrder } = prevStateAlumn;
         if (sortOrder === "desc") {
            muestraAlumnos.sort((a, b) => {
               if (a.nombre > b.nombre) {
                  return -1;
               }
               return a.nombre > b.nombre ? 1 : 0;
            });
         } else {
            muestraAlumnos.sort((a, b) => {
               if (a.nombre < b.nombre) {
                  return -1;
               }
               return a.nombre < b.nombre ? 1 : 0;
            });
         }
         return {
            muestraAlumnos,
            sortOrder: sortOrder === "desc" ? "asc" : "desc"
         };
      });
      var newOrder = this.state.orderAlumn === "desc" ? "asc" : "desc"
      this.setState({ orderAlumn: newOrder });
   };

   onChangeAlumn = e => {
      const query = e.target.value;
      this.setState(prevStateAlumn => ({
         muestraAlumnos:
            query.length > 0
               ? this.filterResultsAlumn(query, prevStateAlumn.alumnos)
               : prevStateAlumn.alumnos
      }));
   };


   showTableAlumn() {
      const Alumns = [];
      let i = 0;
      Alumns.push(
         <div key={i++} className="objectLine anchoFecha">
            <input className="anchoFecha" label="Search" onChange={this.onChangeAlumn} placeholder="Buscar Alumno..." />
            <div>
               <table className="table table-bordered anchoFecha allWidth" >
                  <thead>
                     <tr>
                        <th
                           style={{ cursor: "pointer" }}
                           className="allWidth"
                           onClick={this.sortResultsAlumn}
                           id="name">
                           Nombre {this.state.orderAlumn === "asc" ? <span>&#9650;</span> : <span>&#9660;</span>}
                        </th>
                        <th className="celdaInfo">
                           {this.state.checkAlum ?
                              <button className=" " onClick={this.quitAlumn} >
                                 Quitar selección
                              </button>
                              : null
                           }
                        </th>
                     </tr>
                  </thead>
                  <tbody className="altoParteShort allWidth" onChange={this.handleChange}>
                     {this.state.muestraAlumnos.map(item => (
                        <AlumnRow
                           nombre={item.nombre}
                           key={item.key}
                           // select={ <input type="radio" value={item.nombre + "##SEP##" + item.key} name="selectAlum" onClick={this.toggleAlum(item.key)}/> }
                           select={<input type="radio" value={item.nombre + "##SEP##" + item.key} name="selectAlum" checked={(this.state.selectAlum.split('##SEP##')[0]) === item.nombre} onChange={() => this.toggleAlum(item.nombre)} />}
                        />
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      );
      return Alumns;
   }

   handleChange(event) {
      this.setState({ [event.target.name]: event.target.value.trim() });
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

   clearEmptyLines(string) {
      let dirtyLinesText = string.split('\n');
      let clearText = [""];
      for (let i = 0, x = 0; i < dirtyLinesText.length; i++) {
         if (dirtyLinesText[i].trim() !== "") {
            clearText[x] = dirtyLinesText[i];
            x++;
         }
      }
      // clearText = clearText.join('\n');
      string = clearText.join('\n');
      return clearText.length;
   }
   validate() {
      var correcto = true;
      if (this.state.newNameTar === '' || this.state.newDescrTar === '') {
         alert(' Los campos de nombre y descripción no pueden estar vacíos');
         return false;
      }
      if (!this.state.selectAlum) {
         alert('Debe seleccionar un alumno');
         return false;
      }
      if (!this.state.fechaInicio || !this.state.fechaFinal) {
         alert('Debe poner una fecha de inicio y de final');
         return false;
      } else
         if (this.state.fechaInicio > this.state.fechaFinal) {
            alert(' El rango de las fechas es incorrecto');
            correcto = false;
         }
      let clearText = this.state.newDescrTar
      // clearText = clearText.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "");
      // clearText = this.clearEmptyLines(clearText)
      let total = this.clearEmptyLines(clearText)
      this.setState({ newDescrTar: clearText })
      if (this.state.totalImages > 0 && total !== this.state.totalImages && this.state.type !== 0) {
         alert('El número de elementos descritos no coinciden con el total de imágenes introducidas\nPasos descritos: "' + total + '"\nNúmero de imáges: ' + this.state.totalImages);
         correcto = false;
      }
      return correcto;
   }

   handleSubmitData(event) {
      if (this.validate()) {
         alert('Nombre: "' + this.state.newNameTar + '"\nPasos: "' + this.state.newDescrTar + '"\n Pictogramas: ' + this.state.totalImages);
         var bodyFormData = new FormData();
         bodyFormData.append('nombre', this.state.newNameTar)
         bodyFormData.append('descripcion', this.state.newDescrTar)
         bodyFormData.append('enlaceVideo', this.state.enlaceVideo)
         bodyFormData.append('enlaceAudio', this.state.enlaceAudio)
         bodyFormData.append('type', this.state.type)
         let unAlumno = this.state.selectAlum.split('##SEP##');
         bodyFormData.append('alumno', unAlumno[0])
         bodyFormData.append('alumnoID', unAlumno[1])
         // bodyFormData.append('alumno', this.state.selectAlum)
         bodyFormData.append('fechaInicio', this.state.fechaInicio)
         bodyFormData.append('fechaFinal', this.state.fechaFinal)
         axios({
            method: "post",
            url: `${SERVER_HOST}/tareas/add`,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
         }).then(res => {
            //handle success
            alert('Tarea añadida, se van a guardar las imágenes...');
            this.handleSubmitImage(event);
         }).catch(err => {
            //handle error
            alert('No se ha podido guardar la actividad');
            this.setState({ errorMessage: 'Error, no se ha podido guardar la tarea: ' + err })
         });
      }
      event.preventDefault();
      // this.handleSubmitImage(event);
   }

   handleSubmitImage(event) {
      // let correcto = true;
      for (let i = 0; i < this.state.totalImages; i++) {
         // alert('Guardando imagen: "' + this.state.image[i].value + '"\nDescripción: "' + this.state.newDescrTar + '"');
         var bodyFormData = new FormData();
         // bodyFormData.append('nombreAct', i + "::" + this.state.newNameTar)
         bodyFormData.append('actividad', this.state.newNameTar)
         bodyFormData.append('orden', i + "")
         bodyFormData.append('imagen', this.state.imagePath[i])
         axios({
            method: "post",
            url: `${SERVER_HOST}/tareas/imgAdd`,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
         }).catch(err => {
            //handle error
            alert('Error, no se ha podido guardar la imagen ' + i + ": " + this.state.newNameTar);
            // correcto = false;
            this.setState({ errorMessage: 'Error, no se ha podido guardar la imagen: ' + err })
         });
      }
      // if (correcto) {
      //    alert(" Imágenes guardadas ")
      //    this.setState({ redirectList: true })
      // }
      this.setState({ redirectList: true })
   }

   render() {
      return (
         <div className="web-container">
            <Header />
            {this.state.redirectList ? <Redirect to="/ListaTareas" /> : null}
            <h1>Añadir Comanda</h1>
            <div className="both ">
               <div className="formulario objectline parte">
                  <form onSubmit={this.handleSubmitData} >
                     <div>
                        <label>Nombre de la actividad:</label><br />
                        <input type="text" id="newNameTar" name="newNameTar" placeholder="Tarea a añadir" onChange={this.handleChange} className="inputLine" />
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
                        <textarea id="newDescrTar" name="newDescrTar" onChange={this.handleChange} className="inputLine"
                           // {this.state.type ===1?  ('placeholder="Descripción de pictograma nº 1...&#10;Descripción de pictograma nº 2...&#10;Descripción de pictograma nº 3..."'); ('placeholder="Doesrefsef.'")}
                           placeholder="Descripción nº 1...&#10;Descripción nº 2...&#10;Descripción nº 3..."
                        />
                     </div>
                  </form>
                  <div className=" objectline both">
                     <div className="objectline parte">
                        {this.state.errorAlumn ? <div>Error en actividades: {this.state.errorAlumn}</div> : null}
                        {this.state.mountedAlumn ? null : <div> Cargando alumnos... </div>}
                        {this.showTableAlumn()}
                     </div>
                     <div className=" objectLine anchoFecha parte ">
                        <form className="">
                           <div>
                              <label>Fecha de inicio</label><br />
                              <input className="anchoFecha" type="datetime-local" id="fechaInicio" name="fechaInicio" onChange={this.handleChange}></input>
                           </div>
                           <div>
                              <label>Fecha final</label><br />
                              <input className="anchoFecha" type="datetime-local" id="fechaFinal" name="fechaFinal" onChange={this.handleChange}></input>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
               <div className="objectline secuenciaPicto parte anchoTabla">
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
            <div className="parteBotones ">
               <button className="botonAcciones verde" onClick={this.handleSubmitData}>
                  Asignar Tarea
               </button>
               <Link to="/ListaTareas"><input id="volverTareas" type="button" className="botonAcciones rojo" value="Cancelar" /></Link>
            </div>

         </div>
      );
   }
}
