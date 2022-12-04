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
            completado:'',
            alumno:'',
            type:'',
            alumnoID:'',
            feedbackAlumno:'',
            feedbackProfesor:'',
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
                        this.setState({ completado: res.data.completado})
                        this.setState({ alumnoID: res.data.alumnoID})
                        this.setState({id_t: res.data.id_t})
                        {/*this.setState({ feedbackAlumno: res.data.usuario.feedbackAlumno})*/}
                        {/*this.setState({feedbackProfesor: res.data.feedbackProfesor})*/}
                        this.setState({alumno: res.data.alumno})
                        this.setState({type: res.data.type})
                        {/*this.setState({ id_t: res.data.usuario._id })*/}
                        this.setState({ mounted: true })
                        console.log("tarea 6387d238b255273570ccea6a");
                    }

            }).catch(error => {
                console.log("err:" + error.response.data + " -> tarea 6387d238b255273570ccea6a")
            })
    }

    updateTarea = () => {
        const data = { nombre: this.state.nombre, alumno: this.state.alumno,fechaInicio:this.state.fechaInicio, fechaFinal:this.state.fechaFinal, id_t: this.state.id_t, completado: this.state.completado,
      feedbackAlumno: this.state.feedbackAlumno,feedbackProfesor:this.state.feedbackProfesor, }
        axios.put(`${SERVER_HOST}/tareas/update/${this.state.id_t}`, data, { headers: { "authorization": localStorage.token } })
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



    allFilled = () => {
        if (this.state.nombre !== '' && this.state.usuario !== '')
            return false
        else
            return true
    }
    render() {
        return (
            <div id="registerWeb" className="Body">
                <Header />
                <div className="botonesContainer">
                    {this.state.redirect ? <Redirect to="/ListaTareas" /> : null}
                    <h1>Consulta de Tarea {this.state.id_t}</h1>

                    {this.state.mounted ?
                        <div className="botonesContainer">
                            <div className="item-container">
                                Nombre: {this.state.nombre}
                            </div>
                            <div className="item-container">
                               
                                    <input className={"form-control" ? "" : "error"}
                                        id="username"
                                        type="text"
                                        name="usuario" placeholder="Usuario"
                                        value={this.state.usuario}
                                        onChange={this.handleChange} />
                                </div>

                                <div className="sub-item-container">
                                    <input className={"form-control" ? "" : "error"}
                                        id="password"
                                        type="text"
                                        name="contra" placeholder="Contraseña"
                                        value={this.state.contra}
                                        onChange={this.handleChange} />
                                </div>
                            
                            <div className="item-container">

                                <input className={"form-control" ? "" : "error"}
                                    id="name"
                                    type="text"
                                    name="nombre" placeholder="Nombre Completo"
                                    value={this.state.nombre}
                                    onChange={this.handleChange} />
                            </div>

                        </div>: null }
                        <div id="buttons">
                            <input type="button" className="green-button" value="Modificar Datos" disabled={this.allFilled()} onClick={this.updateTarea} />
                            <input type="button" className="red-button" value="Eliminar Profesor" onClick={this.deleteProfile} />
                        </div>
                    </div>
            </div>
        )
    }
}