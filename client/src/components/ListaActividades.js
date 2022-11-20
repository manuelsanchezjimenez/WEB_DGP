import axios from "axios"
import React, { Component } from "react"
import { Link } from 'react-router-dom'
import Header from "./Header"
import { SERVER_HOST } from "../config/global_constants"
import "../css/AdminAlumPrincipal.css"

// // Datos de prueba
// function createData(nombre, key) {
//    return {
//       nombre, key
//    };
// }
// const tableData = [
//    createData('Actividad1', '1'),
//    createData('Actividad2', '2'),
//    createData('Actividad3', '3'),
//    createData('Actividad4', '4'),
// ];

const ActRow = ({ nombre, modificar }) => {
   return (
      <tr>
         <td>{`${nombre}`}</td>
         <td>{modificar}</td>
         {/* <td>
            {`${id}`}
         <Link to="/ModActividad/${id}"><input id="modActividad" type="button" value="Modificar" /></Link>
         </td> */}
      </tr>
   );
};

export default class ListaActividades extends Component {
   constructor(props) {
      super(props);
      this.state = {
         error: null,
         mounted: false,
         order: "none",
         actividades: [],
         muestraActividades: []
      };
      this.showTable = this.showTable.bind(this);
      this.sortResults = this.sortResults.bind(this);
   }

   componentDidMount() {
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
                  // this.setState({ actividades: tableData, muestraActividades: tableData, mounted: true });
                  this.setState({ actividades: saveData, muestraActividades: saveData, mounted: true });
               }
            } else {
               this.setState({ error: "No se han encontrado actividades" });
               console.log("No se han encontrado actividades")
            }
         })
   }

   filterResults = (query, results) => {
      return results.filter(actividad => {
         const name = actividad.nombre.toLowerCase();
         return name.includes(query.toLowerCase());
      });
   };

   // sortResults(event) {
   sortResults = event => {
      this.setState(prevState => {
         const { muestraActividades, sortOrder } = prevState;
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
      // this.setState({order: order === "desc" ? "asc" : "desc"});
      var newOrder = this.state.order == "desc" ? "asc" : "desc"
      // this.setState({ order: "desc" ? "asc" : "desc"});
      this.setState({ order: newOrder });

   };

   onChange = e => {
      const query = e.target.value;
      this.setState(prevState => ({
         muestraActividades:
            query.length > 0
               ? this.filterResults(query, prevState.actividades)
               : prevState.actividades
      }));
   };

   showTable() {
      const unaActividad = [];
      // for (let i = 0; i < this.state.muestraActividades; i++) {
      let i = 0;
      unaActividad.push(
         <div key={i++}>
            <input label="Search" onChange={this.onChange} placeholder="Buscar Actividad..." />
            <div>
               <table className="table table-bordered" >
                  <tbody>
                     <tr>
                        <th
                           style={{ cursor: "pointer" }}
                           onClick={this.sortResults}
                           // onClick={() => { this.sortResults() }}
                           id="name"
                        >
                           Actividades {this.state.order == "asc" ? <span>&#9650;</span> : <span>&#9660;</span>}
                        </th>
                     </tr>
                     {this.state.muestraActividades.map(item => (
                        <ActRow
                           nombre={item.nombre}
                           modificar={<Link className="boton2" to={{ pathname: `ModActividad/${item.key}` }}> Modificar </Link>}
                           key={item.key}
                        />
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      );
      return unaActividad;
   }

   render() {
      return (
         <div className="web-container">
            <Header />
            <h1>Listado de actividades</h1>
            {this.state.error ? <div>Error: {this.state.error.message}</div> : null}
            {this.state.mounted ? null : <div> Cargando actividades... </div>}
            {this.showTable()}
            <div className="Body">
               <div className="botonesContainer">
                  <Link to="/AddActividad"><input id="addActividad" type="button" value="AÑADIR ACTIVIDAD" /></Link>
                  <Link to="/AddTareaAct"><input id="addTareaAct" type="button" value="ASIGNAR ACTIVIDAD" /></Link>
                  <Link to="/ListaTareas"><input id="toggleATareas" type="button" value="VER TAREAS ASIGNADAS" /></Link>
               </div>
            </div>
         </div>
      )
   }
}
