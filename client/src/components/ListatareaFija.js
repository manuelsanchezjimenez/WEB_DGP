import axios from "axios"
import React, { Component } from "react"
import { Link } from 'react-router-dom'
import Header from "./Header"
import { SERVER_HOST } from "../config/global_constants"
import "../css/ListaTareasFijas.css"

export default class ListaTareasFijas extends Component {
   constructor(props) {
      super(props);

      this.state = {
         error: null,
         mounted: false,
         alumnos: []
      };
   }

   componentDidMount() {
      var bodyFormData = new FormData();
      axios({
         method: "get",
         url: `${SERVER_HOST}/Users/alumnos`,
         data: bodyFormData,
         headers: { "Content-Type": "multipart/form-data" },
      }).then(res => {
         //handle success
         this.setState({ alumnos: res.data })
         this.setState({ mounted: true })
      }).catch(err => {
         //handle error

      });
   }

   render() {
      return (
         <div className="web-container">
            <Header/>
            <h1>Lista de tareas</h1>
            {/* {this.state.error ? <div>Error: {this.state.error.message}</div> : null}
               {this.state.mounted ? null :  <div> Cargando pool de tareas fijas... </div>} */}
            <table className="table table-bordered">
               <thead>
                  <tr>
                     <th className="text-center">Título</th>
                  </tr>
               </thead>
               <tbody>
                  <tr><td>
                     una fila
                  </td>
                  </tr>
                  <tr><td>
                     dos filas
                  </td>
                  </tr>
                  <tr><td>
                     tres filas
                  </td>
                  </tr>
                  <tr><td>
                     cuatro filas
                     </td>
                  </tr>
                  {/* {this.state.tareasFijas.map((item,titulo) => (
                        <tr key={titulo}>
                           hola
                        </tr>
                     ))} */}
               </tbody>
            </table>
            <div className="Body">
                <div className="botonesContainer">
                <input id="add" type="button" className="" value="AÑADIR TAREA FIJA"/>
                <input id="modificar" type="button" className="" value="MODIFICAR TAREA" />
                <input id="toggle" type="button" className="" value="VER TAREAS ASIGNADAS" />
                </div>
                {/*<Link className="red-button" to="/tenantHome"> Cancel Rental</Link>*/}
            </div>
         </div>
      )
   }
}