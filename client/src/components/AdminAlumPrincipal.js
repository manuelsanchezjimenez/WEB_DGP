import axios from "axios"
import React, { Component } from "react"
import { Link } from 'react-router-dom'
import Header from "./Header"
import { SERVER_HOST } from "../config/global_constants"
import "../css/AdminAlumPrincipal.css"

export default class AdminAlumPrincipal extends Component {

   constructor(props) {
      super(props);
      this.state = {
         error: null,
         isLoaded: false,
         alumnos: []
      };
   }

   render() {
      <div>
        <Header></Header>
      </div>
      const { error, isLoaded, alumnos } = this.state;
      if (error) {
         return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
         return <div> Cargando ... </div>;
      } else {
         return (
            <table className="table table-bordered">
               <thead>
                  <tr>
                     <th className="text-center">#</th>
                     <th className="text-center">Nombre</th>
                     <th className="text-center">apellidos</th>
                     <th className="text-center">curso</th>
                  </tr>
               </thead>
               <tbody>

                  {alumnos.map(item => (

                     <tr>
                        <th className="text-center" id={item.id}>{item.id}</th>
                        <td className="text-center">{item.nombre}</td>
                        <td className="text-center">{item.apellidos}</td>
                        <td className="text-center">{item.curso}</td>
                     </tr>

                  ))}

               </tbody>
            </table>

         );
      }
   }
}