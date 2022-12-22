import React, { Component } from "react"
import Header from "./Header"

import { Redirect, Link } from 'react-router-dom'

import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"
import "../css/Feedback.css"

//<Link className="blue-button" to={{pathname: `ConModTeacher/${this.state.id}`}}> Modify </Link>



export default class Feedback extends Component {
   constructor(props) {
      super(props)

      this.state = {
         nombre: '',
         fechaInicio: '',
         fechaFinal: '',
         completado: '',
         alumno: '',
         type: '',
         alumnoID: '',
         feedbackAlumno: '',
         feedbackProfesor: '',
         id_t: '',
         redirect: false,
         mounted: false
      }

   }
   componentDidMount = () => {
      axios.get(`${SERVER_HOST}/tareas/findByID/${this.props.match.params.id}`, { headers: { "authorization": localStorage.token } })
         .then(res => {
            if (res.data)
               if (res.data.errorMessage)
                  console.log(res.data.errorMessage)
               else {
                  this.setState({ nombre: res.data.nombre })
                  this.setState({ fechaInicio: res.data.fechaInicio })
                  this.setState({ fechaFinal: res.data.fechaFinal })
                  this.setState({ completado: res.data.completado })
                  this.setState({ alumnoID: res.data.alumnoID })
                  this.setState({ id_t: res.data.id_t })
                  this.setState({ feedbackAlumno: res.data.feedbackAlum })
                  this.setState({ feedbackProfesor: res.data.feedbackProf })
                  this.setState({ alumno: res.data.alumno })
                  this.setState({ type: res.data.type })
                  this.setState({ id_t: res.data._id })
                  this.setState({ mounted: true })
               }

         }).catch(error => {
            console.log("err:" + error.response.data)
         })
   }

   updateTarea = () => {
      axios.get(`${SERVER_HOST}/Users/usuario/${localStorage.usuario}`, { headers: { "authorization": localStorage.token } })
         .then(res => {
            if (res.data)
               if (res.data.errorMessage)
                  console.log(res.data.errorMessage)
               else {
                  let feedback = this.state.feedbackProfesor + "\n" + `${res.data.usuario.nombre}`
                  console.log(feedback)
                  const data = {
                     nombre: this.state.nombre, alumno: this.state.alumno, fechaInicio: this.state.fechaInicio, fechaFinal: this.state.fechaFinal, id_t: this.state.id_t, completado: this.state.completado,
                     feedbackAlum: this.state.feedbackAlumno, feedbackProf: feedback,
                  }
               axios.put(`${SERVER_HOST}/tareas/update/${this.props.match.params.id}`, data, { headers: { "authorization": localStorage.token } })
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
         }).catch(error => {
            console.log("err:" + error.response.data)
         })
         
   }
   handleChange = e => {

      this.setState({ [e.target.name]: e.target.value })

   }


   allFilled = () => {
      if (this.state.nombre !== '')
         return false
      else
         return true
   }
   render() {
      return (
         <div id="registerWeb" className="Body">
            {this.state.redirect ? <Redirect to="/ListaTareas" /> : null}
            <Header />
            <div className="botonesContainer">
               {this.state.redirect ? <Redirect to="/ListaTareas" /> : null}
               <h1>Consulta de Tarea </h1>

               {this.state.mounted ?
                  <div className="botonesContainer2">
                     <div className="item-container2">
                        <div className="item-container4">
                           Tarea asignada: {this.state.nombre}
                        </div>

                        <br />
                        <div className="item-container4">
                           Alumno asignado: {this.state.alumno}
                        </div>

                        <br />
                        <div className="item-container4">
                           Fecha Inicio: {this.state.fechaInicio.replace('T', '\t').replace('Z', '')}
                        </div>

                        <br />
                        <div className="item-container4">
                           Fecha Final: {this.state.fechaFinal.replace('T', '\t').replace('Z', '')}
                        </div>

                        <br />
                        <div className="item-container4">
                           Tipo de tarea: {this.state.type === 1 ? "Actividad" : "Comanda"}
                        </div>

                        <br />
                        <div className="item-container4">
                           Completada: {this.state.completado === true ? "Completada" : "Sin completar"}
                        </div>

                        <br />


                     </div>
                     <div className="item-container3">
                        <div className="item-container">
                           <div className="item-container5">
                              <h4>Retroalimentacion por parte de {this.state.alumno}</h4>
                              <br />

                              {this.state.feedbackAlumno === '' ? "No hay feedback" : `${this.state.feedbackAlumno}`}
                           </div>
                        </div>
                        <div className="item-container">
                           <div className="item-container5">
                              <h4>Retroalimentacion por parte del profesor</h4>

                              Nivel de satisfaccion:
                              <select id="seleccion" name="feedbackProfesor" defaultValue="bien" onChange={this.handleChange}>
                                 <option value="bien">Bien</option>
                                 <option value="muybien">Muy Bien</option>
                                 <option value="mejora">A mejorar</option>
                              </select>
                              <br />
                              <br />
                              <textarea className="textoFeedback" name="feedbackProfesor" onChange={this.handleChange}>{`${this.state.feedbackProfesor}`}</textarea>
                           </div>
                        </div>
                     </div>

                  </div> : null}
               <div id="buttons">
                  <input type="button" className="green-button" value="Poner feedback" disabled={this.allFilled()} onClick={this.updateTarea} />
                  <Link to="/ListaTareas"><input type="button" className="red-button" value="Volver a la Lista de Tareas" /></Link>
               </div>
            </div>
         </div>
      )
   }
}
