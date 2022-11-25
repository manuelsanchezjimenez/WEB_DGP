import React, { Component } from "react"
import Header from "./Header"

import { Redirect, Link } from 'react-router-dom'

import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"
import "../css/ConModStudent.css"



export default class ConModStudent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            nombre: '',
            nombreMostrar: '',
            usuario: '',
            id_t: '',
            contra: '',
            clase: '',
            tipo: '',
            tipoLetra: '',
            foto: null,
            redirect: false,
            mounted: false
        }

    }
    componentDidMount = () => {
        axios.get(`${SERVER_HOST}/Users/student/${this.props.match.params.id}`, { headers: { "authorization": localStorage.token } })
            .then(res => {
                if (res.data)
                    if (res.data.errorMessage)
                        console.log(res.data.errorMessage)
                    else {
                        this.setState({ nombre: res.data.usuario.nombre })
                        this.setState({ nombreMostrar: res.data.usuario.nombre })
                        this.setState({ usuario: res.data.usuario.usuario })
                        this.setState({ id_t: res.data.usuario._id })
                        this.setState({ clase: res.data.usuario.clase })
                        this.setState({ tipoLetra: res.data.usuario.tipoLetra })
                        this.setState({ tipo: res.data.usuario.tipo })
                        this.setState({ foto: res.data.usuario.foto })
                        this.setState({ mounted: true })
                    }

            }).catch(error => {
                console.log("err:" + error.response.data)
            })
    }

    updateProfile = () => {
        const data = { nombre: this.state.nombre, usuario: this.state.usuario, id: this.state.id_t, contra: this.state.contra, clase: this.state.clase, tipo: this.state.tipo, tipoLetra: this.state.tipoLetra }
        axios.put(`${SERVER_HOST}/Users/profile/student`, data, { headers: { "authorization": localStorage.token } })
            .then(res => {
                if (res.data)
                    if (res.data.errorMessage)
                        console.log(res.data.errorMessage)
                    else {
                        this.setState({ redirect: true })
                    }
            }).catch(error => {
                console.log("err:" + error.response.data)
            })
    }

    deleteProfile = () => {
        axios.delete(`${SERVER_HOST}/Users/delete/student/${this.state.id_t}`, { headers: { "authorization": localStorage.token } })
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

    handleChange = e => {

        this.setState({ [e.target.name]: e.target.value })

    }

    allFilled = () => {
        if (this.state.nombre !== '' && this.state.usuario !== '' && this.state.clase !== '' && this.state.tipo !== '' && this.state.tipoLetra !== '')
            return false
        else
            return true
    }

    render() {
        return (
            <div id="registerWeb" className="Body">
                <Header />
                <div className="botonesContainer">
                    {this.state.redirect ? <Redirect to="/AdminAlumPrincipal" /> : null}

                    <h1>Consulta y Modificación de Alumnos </h1>
                    {this.state.mounted ?
                        <div className="botonesContainer">
                            <div className="item-container">
                                Nombre: {this.state.nombreMostrar}
                            </div>
                            <div className="item-container">
                                <input className={"form-control" ? "" : "error"}
                                    id="userName"
                                    type="text"
                                    name="usuario" placeholder="Nombre de Usuario"
                                    onChange={this.handleChange} ref={input => { this.inputToFocus = input }}
                                    value={this.state.usuario} />

                            </div>


                            <div className="item-container">
                                <input className={"form-control" ? "" : "error"}
                                    id="password"
                                    type="password"
                                    name="contra" placeholder="Contraseña"
                                    onChange={this.handleChange}
                                    value={this.state.contra} />
                            </div>

                            <div className="item-container">

                                <input className={"form-control" ? "" : "error"}
                                    id="name"
                                    type="text"
                                    name="nombre" placeholder="Nombre Completo"
                                    value={this.state.nombre}
                                    onChange={this.handleChange} />
                            </div>
                            <div className="item-container">
                                <input className={"form-control" ? "" : "error"}
                                    id="clase"
                                    type="text"
                                    name="clase" placeholder="Clase"
                                    value={this.state.clase}
                                    onChange={this.handleChange} />
                            </div>

                            <div className="item-container">
                                <label className="user-type--labeled">
                                    <p>Tipo:</p>
                                    <div className="customSelect" value={this.state.tipo} onChange={this.handleChange}>
                                        <select className="form-control" name="tipo" defaultValue="0" onChange={this.handleChange}>
                                            <option value="1">Pictogramas + Texto</option>
                                            <option value="0">Texto</option>
                                        </select>

                                    </div>
                                </label>
                            </div>
                            <div className="item-container">
                                <input className={"form-control" ? "" : "error"}
                                    id="tipoLetra"
                                    type="text"
                                    name="tipoLetra" placeholder="Tipo letra"
                                    value={this.state.tipoLetra}
                                    onChange={this.handleChange} />
                            </div>

                        </div> : null}
                    <div className="register-buttons">
                        <input type="button" className="green-button" value="Modificar Datos" disabled={this.allFilled()} onClick={this.updateProfile} />
                        <input type="button" className="red-button" value="Eliminar Alumno" onClick={this.deleteProfile} />
                    </div>
                </div>

            </div>

        )
    }
}