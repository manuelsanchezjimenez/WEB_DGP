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
         mounted: false,
         alumnos: []
      };
   }

   componentDidMount(){
      axios({
         method: "get",
         url: `${SERVER_HOST}/Users/alumnos`,
         data: bodyFormData,
         headers: { "Content-Type": "multipart/form-data" },
     }).then(res => {
         //handle success
         this.setState({alumnos: res.data}) 
         this.setState({mounted: true})
     }).catch(err => {
         //handle error
         
     });
   }

   render() {
      return(
         <div className="web-container">
            <Header/>
            {this.state.error ? <div>Error: {this.state.error.message}</div> : null}
            {this.state.mounted ? null :  <div> Cargando ... </div>}
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
                  {this.state.alumnos.map((item,index) => (
                     <tr key={index}>
                        <th className="text-center" id={item.id}>{item.id}</th>
                        <td className="text-center">{item.nombre}</td>
                        <td className="text-center">{item.apellidos}</td>
                        <td className="text-center">{item.curso}</td>
                     </tr>
                  ))}
               </tbody>
            </table>         
         </div>
      )
   }
}