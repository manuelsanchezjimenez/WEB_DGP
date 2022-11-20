import axios from "axios"
import React, { Component } from "react"
import { Redirect, Link } from 'react-router-dom'
import Header from "./Header"
import { SERVER_HOST } from "../config/global_constants"

import "../css/AddTareaAct.css"

const AlumnRow = ({ nombre, select }) => {
   return (
      <tr>
         <td>{`${nombre}`}</td>
         <td>
            <input type="radio" value={`${select}`} name="selectAlum" />
         </td>
      </tr>
   )
}
const ActRow = ({ nombre, select }) => {
   return (
      <tr>
         <td>{`${nombre}`}</td>
         <td>
            <input type="radio" value={`${select}`} name="selectAct" />
         </td>

      </tr>
   );
};

export default class AddTareaAct extends Component {
   constructor(props) {
      super(props);
      this.state = {
         errorAlumn: null,
         errorAct: null,
         mountedAlumn: false,
         mountedAct: false,
         selectAlum: "",
         selectAct: "",
         orderAlumn: "none",
         orderAct: "none",
         alumnos: [],
         muestraAlumnos: [],
         actividades: [],
         muestraActividades: [],
         adicional: "",
         redirectList: false,
      };
      this.showTableAlumn = this.showTableAlumn.bind(this);
      this.showTableAct = this.showTableAct.bind(this);
      this.sortResultsAlumn = this.sortResultsAlumn.bind(this);
      this.sortResultsAct = this.sortResultsAct.bind(this);
      this.validate = this.validate.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmitData = this.handleSubmitData.bind(this);
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
                  this.setState({ error: res.data.errorMessage });
               } else {
                  let getData = JSON.parse(JSON.stringify(res.data).toString());
                  let saveData = [];
                  for (let i = 0; i < getData.length; i++) {
                     saveData.push({ nombre: getData[i].nombre, Usuario: getData[i].usuario, key: getData[i]._id });
                  }
                  // this.setState({ actividades: tableData, muestraAlumnos: tableData, mounted: true });

                  this.setState({ alumnos: saveData, muestraAlumnos: saveData, mounted: true });
                  console.log(this.state.alumnos[0]);
               }
            } else {
               this.setState({ error: "No se han encontrado alumnos" });
               console.log("No se han encontrado alumnos")
            }
         })
      axios.get(
         `${SERVER_HOST}/actividades/getAll`,
         { headers: { "Content-type": "multipart/form-data" } })
         .then(res => {
            if (res.data) {
               if (res.data.errorMessage) {
                  alert("No se han podido tomar los datos " + res.data.errorMessage);
                  console.log(res.data.errorMessage)
                  this.setState({ error: res.data.errorMessage });
               } else {
                  let getData = JSON.parse(JSON.stringify(res.data).toString());
                  let saveData = [];
                  for (let i = 0; i < getData.length; i++) {
                     saveData.push({ nombre: getData[i].nombre, key: getData[i]._id });
                  }
                  // this.setState({ actividades: tableData, muestraActividades: tableData, mountedAct: true });
                  this.setState({ actividades: saveData, muestraActividades: saveData, mountedAct: true });
               }
            } else {
               this.setState({ error: "No se han encontrado actividades" });
               console.log("No se han encontrado actividades")
            }
         })
   }

   filterResultsAlumn = (query, results) => {
      return results.filter(alumno => {
         const name = alumno.nombre.toLowerCase();

         return name.includes(query);
      });
   };
   filterResultsAct = (query, results) => {
      return results.filter(actividad => {
         const name = actividad.nombre.toLowerCase();
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
   };
   sortResultsAct = event => {
      this.setState(prevStateAct => {
         const { muestraActividades, sortOrder } = prevStateAct;
         if (sortOrder === "desc") {
            muestraActividades.sort((a, b) => {
               if (a.nombre > b.nombre) {
                  return -1;
               }
               return a.nombre > b.nombre ? 1 : 0;
            });
         } else {
            muestraActividades.sort((a, b) => {
               if (a.nombre < b.nombre) {
                  return -1;
               }
               return a.nombre < b.nombre ? 1 : 0;
            });
         }
         return {
            muestraActividades,
            sortOrder: sortOrder === "desc" ? "asc" : "desc"
         };
      });
      // this.setState({orderAct: orderAct === "desc" ? "asc" : "desc"});
      var newOrder = this.state.orderAct == "desc" ? "asc" : "desc"
      // this.setState({ orderAct: "desc" ? "asc" : "desc"});
      this.setState({ orderAct: newOrder });

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
   onChangeAct = e => {
      const query = e.target.value;
      this.setState(prevStateAct => ({
         muestraActividades:
            query.length > 0
               ? this.filterResultsAct(query, prevStateAct.actividades)
               : prevStateAct.actividades
      }));
   };

   showTableAlumn() {
      const Alumns = [];
      let i = 0;
      Alumns.push(
         <div key={i++} className="objectLine anchoTabla">
            <input className="anchoTabla" label="Search" onChange={this.onChangeAlumn} placeholder="Buscar Alumno..." />
            <div>
               <table className="table table-bordered" >
                  <thead>
                     <tr>
                        <th
                           style={{ cursor: "pointer" }}
                           onClick={this.sortResultsAlumn}
                           id="name">
                           Nombre {this.state.orderAlumn == "asc" ? <span>&#9650;</span> : <span>&#9660;</span>}
                        </th>
                     </tr>
                  </thead>
                  <tbody className="altoParte" onChange={this.handleChange}>
                     {this.state.muestraAlumnos.map(item => (
                        <AlumnRow
                           nombre={item.nombre}
                           key={item.key}
                           select={item.key}
                        />
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      );
      return Alumns;
   }
   showTableAct() {
      const unaActividad = [];
      let i = 0;
      unaActividad.push(
         <div key={i++} className="objectLine anchoTabla">
            <input className="anchoTabla" label="Search" onChange={this.onChangeAct} placeholder="Buscar Actividad..." />
            <div>
               <table className=" table table-bordered" >
                  <thead>
                     <tr>
                        <th
                           style={{ cursor: "pointer" }}
                           onClick={this.sortResultsAct}
                           id="name">
                           Actividades {this.state.orderAct == "asc" ? <span>&#9650;</span> : <span>&#9660;</span>}
                        </th>
                     </tr>
                  </thead>
                  <tbody className="altoParte" onChange={this.handleChange}>
                     {this.state.muestraActividades.map(item => (
                        <ActRow
                           nombre={item.nombre}
                           key={item.key}
                           select={item.key}
                        />
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      );
      return unaActividad;
   }

   handleSubmitData(event) {
      if (this.validate()) {
         var bodyFormData = new FormData();
         // bodyFormData.append('nombre', this.state.newNameAct)
         bodyFormData.append('alumno', this.state.selectAlum)
         bodyFormData.append('actividad', this.state.selectAct)
         bodyFormData.append('fechaInicio', this.state.fechaInicio)
         bodyFormData.append('fechaFinal', this.state.fechaFinal)
         bodyFormData.append('adicional', this.state.adicional)
         axios({
            method: "post",
            url: `${SERVER_HOST}/tareas/addTareaActividad`,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
         }).then(res => {
            //handle success
            alert('Actividad asignada, redirigiendo a la lista de tareas...');
            this.setState({ redirectList: true })

         }).catch(err => {
            //handle error
            alert('No se ha podido guardar la actividad');
            this.setState({ logInError: true, errorMessage: 'Error, no se ha podido guardar la actividad.' })
         });
      }
      event.preventDefault();
   }
   handleChange(event) {
      this.setState({ [event.target.name]: event.target.value });
   }
   validate() {
      var correcto = true;
      if (!this.state.fechaInicio || !this.state.fechaFinal) {
         alert('Debe poner una fecha de inicio y de final');
         correcto = false;
      } else
         if (this.state.fechaInicio > this.state.fechaFinal) {
            alert(' El rango de las fechas es incorrecto');
            correcto = false;
         }
      if (!this.state.selectAlum || !this.state.selectAct) {
         alert('Debe seleccionar un alumno y la tarea que quiera asignarle');
         correcto = false;
      }
      return correcto;
   }

   render() {
      return (
         <div className="web-container">
            <Header />
            {/* {this.state.redirectList ? <Redirect to="/ListaTareas" /> : null} */}
            <h1>Listado de actividades</h1>
            {this.state.errorAlumn ? <div>Error en actividades: {this.state.errorAlumn.message}</div> : null}
            {this.state.mountedAlumn ? null : <div> Cargando alumnos... </div>}
            {this.state.errorAct ? <div>Error en alumnos: {this.state.errorAct.message}</div> : null}
            {this.state.mountedAct ? null : <div> Cargando actividades... </div>}

            {this.showTableAlumn()}
            {this.showTableAct()}
            {/* <form className="anchoFecha objectLine"> */}
            <div className="anchoFecha objectLine">
               <form>
                  <div>
                     <label>Fecha de inicio</label><br />
                     <input type="datetime-local" id="fechaInicio" name="fechaInicio" onChange={this.handleChange}></input>
                  </div>
                  <div>
                     <label>Fecha final</label><br />
                     <input type="datetime-local" id="fechaFinal" name="fechaFinal" onChange={this.handleChange}></input>
                  </div>
                  <div>
                     <label>Descripción:</label><br />
                     <textarea id="adicional" name="adicional" placeholder="Notas adicionales" onChange={this.handleChange} />
                  </div>
                  <button className="button" onClick={this.handleSubmitData}>
                     ASIGNAR
                  </button>
                  <Link to="/ListaTareas"><input id="toggleATareas" type="button" value="CANCELAR" /></Link>
               </form>
            </div>
            <div className="Body">
            </div>
         </div>
      )
   }
}
