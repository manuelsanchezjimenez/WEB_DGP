import axios from "axios"
import React, { Component } from "react"
import { Link } from 'react-router-dom'
import Header from "./Header"
import { SERVER_HOST } from "../config/global_constants"
import "../css/AdminAlumPrincipal.css"

const ProfeRow = ({ nombre, Usuario, modificacion }) => {
   return (
      <tr className="allWidth">
         <td className="celdaInfo">{`${nombre}`}</td>
         <td className="celdaInfo">{`${Usuario}`}</td>
         <td className="celdaCorta">{modificacion}</td>
      </tr>
   )
}

export default class ListaAlumnos extends Component {
   constructor(props) {
      super(props);
      this.state = {
         error: null,
         mounted: false,
         search: "",
         order: [],
         profesores: [],
         muestraProfesores: []
      };
      this.showTable = this.showTable.bind(this);
      this.sorting = this.sorting.bind(this);
   }
   componentDidMount() {
      axios.get(
         `${SERVER_HOST}/Users/teacher`,
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
                  // this.setState({ actividades: tableData, muestraProfesores: tableData, mounted: true });

                  this.setState({ profesores: saveData, muestraProfesores: saveData, mounted: true });
                  console.log(this.state.profesores[0]);
               }
            } else {
               this.setState({ error: "No se han encontrado profesores" });
               console.log("No se han encontrado profesores")
            }
         })
   }
   filterResults = (query, results) => {
      return results.filter(profesor => {
         const name = profesor.nombre.toLowerCase();
         const user = profesor.Usuario.toLowerCase();
         return name.includes(query.toLowerCase())
            || user.includes(query.toLowerCase());
      });
   };

   sorting = (col) => {
      this.setState(prevState => {
         const { muestraProfesores, sortOrder } = prevState;
         if (sortOrder === "desc") {
            muestraProfesores.sort((a, b) => {
               if (a[col] > b[col]) {
                  return -1;
               }
               return a[col] > b[col] ? 1 : 0;
            });
         } else {
            muestraProfesores.sort((a, b) => {
               if (a[col] < b[col]) {
                  return -1;
               }
               return a[col] < b[col] ? 1 : 0;
            });
         }
         return {
            muestraProfesores,
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
         muestraProfesores:
            query.length > 0
               ? this.filterResults(query, prevState.profesores)
               : prevState.profesores
      }));
   };

   deleteProfile = (id) => {
      axios.delete(`${SERVER_HOST}/Users/delete/teacher/${id}`, { headers: { "authorization": localStorage.token } })
         .then(res => {
            if (res.data)
               if (res.data.errorMessage)
                  console.log(res.data.errorMessage)
               else
                  this.setState({ redirect: true })

         }).catch(error => {
            console.log("err:" + error.response.data)
         })
   }

   showTable() {
      const pictos = [];

      // for (let i = 0; i < this.state.muestraActividades; i++) {
      let i = 0;
      pictos.push(
         <div key={i++}>
            <input label="Search" onChange={this.onChange} placeholder="Buscar Profesor..." />
            <div>
               <table className="table table-bordered" >
                  <tbody>
                     <tr>
                        <th
                           style={{ cursor: "pointer" }}
                           className="celdaInfo"
                           id="name"
                           onClick={() => { this.sorting("nombre") }}
                        >
                           Nombre {!this.state.order.nombre ? null : this.state.order.nombre === "asc" ? <span>&#9650;</span> : <span>&#9660;</span>}
                        </th>
                        <th
                           style={{ cursor: "pointer" }}
                           className="celdaInfo"
                           id="name"
                           onClick={() => { this.sorting("Usuario") }}
                        >
                           Usuario {!this.state.order.Usuario ? null : this.state.order.Usuario === "asc" ? <span>&#9650;</span> : <span>&#9660;</span>}
                        </th>
                        <th className="celdaCorta">
                           Moficacion
                        </th>
                     </tr>
                     {this.state.muestraProfesores.map(item => (
                        <ProfeRow
                           nombre={item.nombre}
                           Usuario={item.Usuario}
                           curso={item.curso}
                           key={item.key}
                           modificacion={<Link className="boton2" to={{ pathname: `ConModTeacher/${item.key}` }}> Ver </Link>}
                        />
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      );
      return pictos;
   }
   render() {
      return (
         <div className="web-container">
            <Header />
            <div className="Pantalla">
               <div className="Tabla">


                  {this.state.error ? <div>Error: {this.state.error.message}</div> : null}
                  {this.state.mounted ? null : <div> Cargando Profesores... </div>}
                  {this.showTable()}
               </div>
               <div>
               </div>
               <div className="Body">
                  <div className="botonesContainer">
                     {/* <Link to="/AdminAlumPrincipal"><input id="modificarAlumno" type="button" className="boton3" value="MODIFICAR ALUMNO" /></Link>
                  <Link to="/AdminAlumPrincipal"><input id="eliminarAlumno" type="button" className="boton3" value="ELIMINAR ALUMNO" /></Link> */}

                     <Link to={{ pathname: `Register/teacher` }}><input id="aniadiProfesor" type="button" className="boton2" value="AÑADIR PROFESOR" /></Link>

                  </div>
               </div></div>
         </div>

      )
   }



}
