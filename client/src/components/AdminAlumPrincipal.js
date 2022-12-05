import axios from "axios"
import React, { Component } from "react"
import { Link } from 'react-router-dom'
import Header from "./Header"
import { ACCESS_LEVEL_ADMIN, SERVER_HOST } from "../config/global_constants"

import "../css/AdminAlumPrincipal.css"

const AlumnRow = ({ nombre, Usuario, curso, modificacion }) => {
   return (
      <tr className="allWidth">
         <td className="celdaInfo">{`${nombre}`}</td>
         <td className="celdaInfo">{`${Usuario}`}</td>
         <td className="celdaCorta">{`${curso}`}</td>
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
         order: [],
         alumnos: [],
         muestraAlumnos: []
      };
      this.showTable = this.showTable.bind(this);
      this.sorting = this.sorting.bind(this);
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
                     saveData.push({ nombre: getData[i].nombre, Usuario: getData[i].usuario, curso: getData[i].clase, key: getData[i]._id });
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
   }
   filterResults = (query, results) => {
      return results.filter(alumno => {
         const name = alumno.nombre.toLowerCase();
         const user = alumno.Usuario.toLowerCase();
         // const curso = String.valueOf(alumno.curso);
         // const curso = alumno.curso.toLowerCase();
         return name.includes(query.toLowerCase())
            || user.includes(query.toLowerCase())
            // || curso.includes(query.toLowerCase())
            ;
      });
   };

   sorting = (col) => {
      this.setState(prevState => {
         const { muestraAlumnos, sortOrder } = prevState;
         if (sortOrder === "desc") {
            muestraAlumnos.sort((a, b) => {
               if (a[col] > b[col]) {
                  return -1;
               }
               return a[col] > b[col] ? 1 : 0;
            });
         } else {
            muestraAlumnos.sort((a, b) => {
               if (a[col] < b[col]) {
                  return -1;
               }
               return a[col] < b[col] ? 1 : 0;
            });
         }
         return {
            muestraAlumnos,
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
         muestraAlumnos:
            query.length > 0
               ? this.filterResults(query, prevState.alumnos)
               : prevState.alumnos
      }));
   };
   deleteProfile = (id) => {
      axios.delete(`${SERVER_HOST}/Users/delete/student/${id}`, { headers: { "authorization": localStorage.token } })
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
      const Alumns = [];
      let i = 0;
      Alumns.push(
         <div key={i++}>
            <input label="Search" onChange={this.onChange} placeholder="Buscar Alumno..." />
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
                        <th
                           style={{ cursor: "pointer" }}
                           className="celdaCorta"
                           id="name"
                           onClick={() => { this.sorting("curso") }}
                        >
                           Curso {!this.state.order.curso ? null : this.state.order.curso === "asc" ? <span>&#9650;</span> : <span>&#9660;</span>}
                        </th>
                        <th className="celdaCorta">
                           Moficacion
                        </th>
                     </tr>
                     {this.state.muestraAlumnos.map(item => (
                        parseInt(localStorage.accessLevel) === ACCESS_LEVEL_ADMIN ?
                           <AlumnRow
                              nombre={item.nombre}
                              Usuario={item.Usuario}
                              curso={item.curso}
                              key={item.key}
                              modificacion={<Link className="boton2" to={{ pathname: `ConModStudent/${item.key}` }}> Ver </Link>}
                           /> :

                           <AlumnRow
                              nombre={item.nombre}
                              Usuario={item.Usuario}
                              curso={item.curso}
                              key={item.key}

                           />


                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      );
      return Alumns;
   }
   render() {
      return (
         <div className="web-container">
            <Header />
            <div className="Pantalla">
               <div className="Tabla">


                  {this.state.error ? <div>Error: {this.state.error.message}</div> : null}
                  {this.state.mounted ? null : <div> Cargando alumnos... </div>}
                  {this.showTable()}
               </div>
               <div>
               </div>
               <div className="Body">
                  {parseInt(localStorage.accessLevel) === ACCESS_LEVEL_ADMIN ?
                     <div className="botonesContainer">
                        <Link to={{ pathname: `Register/student` }}><input id="aniadirAlumno" type="button" className="boton2" value="AÑADIR ALUMNO" /></Link>
                     </div> : null}

               </div></div>
         </div>

      )
   }



}
