import axios from "axios"
import React, { Component } from "react"
import { Link } from 'react-router-dom'
import Header from "./Header"
import { SERVER_HOST } from "../config/global_constants"
import "../css/ListaTareasAct.css"

const TarRow = ({ nombre, fechaInicio, fechaFinal, completado, alumno, type, acceso }) => {
   return (
      <tr className="allWidth">
         <td className="celdaInfo">{`${alumno}`}</td>
         <td className="celdaInfo">{`${nombre}`}</td>
         <td className="celdaCorta">{`${fechaInicio}`}</td>
         <td className="celdaCorta">{`${fechaFinal}`}</td>
         {/* <td className="celdaCorta">{`${type}` === "1" ? "Actividad" : "Comanda"}</td> */}
         <td className="celdaCorta">
            {
               {
                  '0': "Descripción",
                  '1': "Pasos",
                  '2': "Contador",
                  '3': "CheckList"
               }[type]
            }
         </td>
         <td className="celdaCorta">{`${completado}` === true ? "Finalizada" : "No Completada"}</td>
         <td>{acceso}</td>
      </tr>
   );
};

export default class ListaTareas extends Component {
   constructor(props) {
      super(props);
      this.state = {
         error: null,
         mounted: false,
         order: [],
         tareas: [],
         muestraTareas: []
      };
      this.showTable = this.showTable.bind(this);
      this.sorting = this.sorting.bind(this);
      this.fechaformat = this.fechaformat.bind(this);
   }

   componentDidMount() {
      axios.get(
         `${SERVER_HOST}/tareas/getAll`,
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
                     saveData.push({ key: getData[i]._id, nombre: getData[i].nombre, fechaInicio: getData[i].fechaInicio, fechaFinal: getData[i].fechaFinal, completado: getData[i].completado, alumno: getData[i].alumno, type: getData[i].type });
                     console.log("Tarea " + i + " key: " + getData[i]._id);
                  }
                  this.setState({ tareas: saveData, muestraTareas: saveData, mounted: true });
               }
            } else {
               this.setState({ error: "No se han encontrado tareas" });
               console.log("No se han encontrado tareas")
            }
         })
   }

   filterResults = (query, results) => {
      return results.filter(tarea => {
         const name = tarea.nombre.toLowerCase();
         const fechIni = tarea.fechaInicio.toLowerCase();
         const fechFin = tarea.fechaFinal.toLowerCase();
         const comp = (tarea.completado === true ? "Completada" : "Sin completar").toLowerCase();
         const alumn = tarea.alumno.toLowerCase();
         const type = (tarea.type === 1 ? "Actividad" : "Comanda").toLowerCase();
         return name.includes(query.toLowerCase())
            || fechIni.includes(query.toLowerCase())
            || fechFin.includes(query.toLowerCase())
            || comp.includes(query.toLowerCase())
            || alumn.includes(query.toLowerCase())
            || type.includes(query.toLowerCase())
            ;
      });
   };

   sorting = (col) => {
      this.setState(prevState => {
         const { muestraTareas, sortOrder } = prevState;
         if (sortOrder === "desc") {
            muestraTareas.sort((a, b) => {
               if (a[col] > b[col]) {
                  return -1;
               }
               return a[col] > b[col] ? 1 : 0;
            });
         } else {
            muestraTareas.sort((a, b) => {
               if (a[col] < b[col]) {
                  return -1;
               }
               return a[col] < b[col] ? 1 : 0;
            });
         }
         return {
            muestraTareas,
            sortOrder: sortOrder === "desc" ? "asc" : "desc"
         };
      });
      var newOrder = this.state.order[col] === "desc" ? "asc" : "desc"
      let copyOrder = { [col]: newOrder };
      this.setState({ order: copyOrder });
   }

   onChange = e => {
      const query = e.target.value;
      this.setState(prevState => ({
         muestraTareas:
            query.length > 0
               ? this.filterResults(query, prevState.tareas)
               : prevState.tareas
      }));
   };

   fechaformat(dateTime) {
      var date = new Date(dateTime);
      var fechaFormateada =
         ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) +
         '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) +
         '/' + date.getFullYear() +
         ", " + ((date.getHours() > 9) ? date.getHours() : ('0' + date.getHours())) +
         ":" + ((date.getMinutes() > 9) ? date.getMinutes() : ('0' + date.getMinutes()));
      return (fechaFormateada);
   }

   showTable() {
      const unaTarea = [];
      let i = 0;
      unaTarea.push(
         <div key={i++}>
            <input label="Search" onChange={this.onChange} placeholder="Buscar Tarea por alumno, nombre, fecha..." className="buscarFiltro" />
            <div>
               <table className="table table-bordered TablaLista" >
                  <thead>
                     <tr>
                        <th className="celdaInfo"
                           style={{ cursor: "pointer" }}
                           id="alu"
                           // className="celdaInfo"
                           onClick={() => { this.sorting("alumno") }}>
                           Alumno {!this.state.order.alumno ? null : this.state.order.alumno === "asc" ? <span>&#9650;</span> : <span>&#9660;</span>}
                        </th>
                        {/* </tr>
                     <tr */}
                        <th className="celdaInfo"
                           style={{ cursor: "pointer" }}
                           id="tar"
                           // className="celdaInfo"
                           onClick={() => this.sorting("nombre")}>
                           Tarea {!this.state.order.nombre ? null : this.state.order.nombre === "asc" ? <span>&#9650;</span> : <span>&#9660;</span>}
                        </th>
                        {/* </tr>
                     <tr */}
                        <th className="celdaCorta"
                           style={{ cursor: "pointer" }}
                           id="ini"
                           // className="celdaCorta"
                           onClick={() => this.sorting("fechaInicio")}>
                           Fecha de inicio {!this.state.order.fechaInicio ? null : this.state.order.fechaInicio === "asc" ? <span>&#9650;</span> : <span>&#9660;</span>}
                        </th>
                        {/* </tr>
                     <tr */}
                        <th className="celdaCorta"
                           style={{ cursor: "pointer" }}
                           id="fin"
                           // className="celdaCorta"
                           onClick={() => this.sorting("fechaFinal")}>
                           Fecha final {!this.state.order.fechaFinal ? null : this.state.order.fechaFinal === "asc" ? <span>&#9650;</span> : <span>&#9660;</span>}
                        </th>
                        {/* </tr>
                     <tr */}
                        <th className="celdaCorta"
                           style={{ cursor: "pointer" }}
                           id="tip"
                           // className="celdaCorta"
                           onClick={() => this.sorting("type")}>
                           Tipo {!this.state.order.type ? null : this.state.order.type === "asc" ? <span>&#9650;</span> : <span>&#9660;</span>}
                        </th>
                        {/* </tr>
                     <tr */}
                        <th className="celdaCorta"
                           style={{ cursor: "pointer" }}
                           id="com"
                           // className="celdaCorta"
                           onClick={() => this.sorting("completado")}>
                           Completado {!this.state.order.completado ? null : this.state.order.completado === "asc" ? <span>&#9650;</span> : <span>&#9660;</span>}
                        </th>
                        <th className="celdaCorta">
                        </th>
                     </tr>
                  </thead>
                  <tbody className="allWidth tablaTareas">
                     {/* <tr> */}
                     {this.state.muestraTareas.map(item => (
                        <TarRow
                           nombre={item.nombre}
                           // fechaInicio={item.fechaInicio}
                           // fechaFinal={item.fechaFinal}
                           fechaInicio={this.fechaformat(item.fechaInicio)}
                           fechaFinal={this.fechaformat(item.fechaFinal)}
                           completado={item.completado}
                           alumno={item.alumno}
                           type={item.type}
                           acceso={<Link className="botonAcciones botonTablaTareas" to={{ pathname: `Feedback/${item.key}` }}> Acceder </Link>}
                           id={item.key}
                           key={item.key}
                        />
                     ))}
                     {/* </tr> */}
                  </tbody>
               </table>
            </div>
         </div>
      );
      return unaTarea;
   }

   render() {
      return (
         <div className="web-container">
            <Header />
            <h1>Lista de tareas</h1>
            <div className="both">
               <div className="objectline parte listaTareasTabla">
                  {this.state.error ? <div>Error: {this.state.error}</div> : null}
                  {this.state.mounted ? null : <div> Cargando tareas... </div>}
                  {this.showTable()}
               </div>
               <div className="botonesLista parteBotonesVertical objectline parte">
                  <Link to="/AddTarea"><input id="AddTarea" type="button" value="Añadir Comanda" className="botonAcciones" /></Link>
                  <Link to="/AddAsignarAct"><input id="AddAsignarAct" type="button" value="Asignar Actividad" className="botonAcciones" /></Link>
                  <Link to="/ListaActividades"><input id="toggleAActs" type="button" value="Ver Actividades" className="botonAcciones botonToggle" /></Link>
               </div>
            </div>
         </div>
      )
   }
}
