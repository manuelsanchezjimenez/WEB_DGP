import axios from "axios"
import React, { Component } from "react"
import { Link } from 'react-router-dom'
import Header from "./Header"
import { SERVER_HOST } from "../config/global_constants"
import "../css/AdminAlumPrincipal.css"

const TarRow = ({ nombre, fechaInicio, fechaFinal, completado, alumno, type }) => {
   var tipo;
   if (type === 0)
      tipo = "comanda";

   return (
      <tr>
         <td>{`${alumno}`}</td>
         <td>{`${nombre}`}</td>
         <td>{`${fechaInicio}`}</td>
         <td>{`${fechaFinal}`}</td>
         <td>{`${type}` === 1 ? "Actividad" : "Comanda"}</td>
         <td>{`${completado}` === true ? "Sí" : "No"}</td>
      </tr>
   );
};

export default class ListaTareas extends Component {
   constructor(props) {
      super(props);
      this.state = {
         error: null,
         mounted: false,
         order: "none",
         tareas: [],
         muestraTareas: []
      };
      this.showTable = this.showTable.bind(this);
      this.sortResults = this.sortResults.bind(this);
      this.sorting = this.sorting.bind(this);
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
         const comp = tarea.completado.toLowerCase();
         const alumn = tarea.alumno.toLowerCase();
         const type = tarea.type.toLowerCase();
         return name.includes(query.toLowerCase())
            || fechIni.includes(query.toLowerCase())
            || fechFin.includes(query.toLowerCase())
            || comp.includes(query.toLowerCase())
            || alumn.includes(query.toLowerCase())
            || type.includes(query.toLowerCase())
            ;
      });
   };

   sortResults = event => {
      this.setState(prevState => {
         const { muestraTareas, sortOrder } = prevState;
         if (sortOrder === "desc") {
            muestraTareas.sort((a, b) => {
               if (a.nombre > b.nombre) {
                  return -1;
               }
               return a.nombre > b.nombre ? 1 : 0;
            });
         } else {
            muestraTareas.sort((a, b) => {
               if (a.nombre < b.nombre) {
                  return -1;
               }
               return a.nombre < b.nombre ? 1 : 0;
            });
         }
         return {
            muestraTareas,
            sortOrder: sortOrder === "desc" ? "asc" : "desc"
         };
      });
      // this.setState({order: order === "desc" ? "asc" : "desc"});
      var newOrder = this.state.order === "desc" ? "asc" : "desc"
      // this.setState({ order: "desc" ? "asc" : "desc"});
      this.setState({ order: newOrder });
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
      // this.setState({order: order === "desc" ? "asc" : "desc"});
      // var newOrder = this.state.order == "desc" ? "asc" : "desc"
      // this.setState({ order: "desc" ? "asc" : "desc"});
      // this.setState({ order: newOrder });
   }
   // sorting = (col) => {
   //    if (order === 'asc') {
   //       const sorted = {
   //          ...data, ["results"]: data.results.sort((a, b) =>
   //             a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
   //          )
   //       }
   //       setData(sorted);
   //       setOrder('desc')
   //    }
   //    if (order === 'desc') {

   //       const sorted = {
   //          // ...data, ["result"]: data.results.sort((a, b) =>
   //          ...data, ["result"]: data.results.sort((a, b) =>
   //             a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
   //          )
   //       }
   //       setData(sorted);
   //       setOrder('asc')
   //    }
   // }

   onChange = e => {
      const query = e.target.value;
      this.setState(prevState => ({
         muestraTareas:
            query.length > 0
               ? this.filterResults(query, prevState.tareas)
               : prevState.tareas
      }));
   };

   showTable() {
      const unaTarea = [];
      // for (let i = 0; i < this.state.muestraTareas; i++) {
      let i = 0;
      unaTarea.push(
         <div key={i++}>
            <input label="Search" onChange={this.onChange} placeholder="Buscar Tarea..." />
            <div>
               <table className="table table-bordered" >
                  <tbody>
                     <tr>
                        {/* <th
                           style={{ cursor: "pointer" }}
                           onClick={this.sortResults}
                           // onClick={() => { this.sortResults() }}
                           id="name"
                        >
                           aparte {this.state.order === "asc" ? <span>&#9650;</span> : <span>&#9660;</span>}
                        </th> */}
                        <th
                           style={{ cursor: "pointer" }}
                           // onClick={() => { this.sortResults() }}
                           id="name"
                           onClick={() => this.sorting("alumno")}>
                           Alumno
                        </th>
                        <th
                           style={{ cursor: "pointer" }}
                           // onClick={() => { this.sortResults() }}
                           id="name"
                           onClick={() => this.sorting("nombre")}>
                           Tarea
                        </th>
                        <th
                           style={{ cursor: "pointer" }}
                           // onClick={() => { this.sortResults() }}
                           id="name"
                           onClick={() => this.sorting("fechaInicio")}>
                           Fecha de inicio
                        </th>
                        <th
                           style={{ cursor: "pointer" }}
                           // onClick={() => { this.sortResults() }}
                           id="name"
                           onClick={() => this.sorting("fechaFinal")}>
                           Fecha final
                        </th>
                        <th
                           style={{ cursor: "pointer" }}
                           // onClick={() => { this.sortResults() }}
                           id="name"
                           onClick={() => this.sorting("type")}>
                           Tipo
                        </th>
                        <th
                           style={{ cursor: "pointer" }}
                           // onClick={() => { this.sortResults() }}
                           id="name"
                           onClick={() => this.sorting("completado")}>
                           Completado
                        </th>
                     </tr>
                     {this.state.muestraTareas.map(item => (
                        <TarRow
                           nombre={item.nombre}
                           fechaInicio={item.fechaInicio}
                           fechaFinal={item.fechaFinal}
                           completado={item.completado}
                           alumno={item.alumno}
                           type={item.type}
                           id={item.key}
                           key={item.key}
                        />
                     ))}
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
            {this.state.error ? <div>Error: {this.state.error.message}</div> : null}
            {this.state.mounted ? null : <div> Cargando tareas... </div>}
            {this.showTable()}
            <div className="Body">
               <div className="botonesContainer">
                  <Link to="/AddTareaAct"><input id="addTareaAct" type="button" value="ASIGNAR ACTIVIDAD" /></Link>
                  <Link to="/ListaActividades"><input id="toggleTareas" type="button" value="VER POOL DE ACTIVIDADES" /></Link>
               </div>
            </div>
         </div>
      )
   }
}




