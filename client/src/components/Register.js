import React, { Component } from "react"

import { Redirect, Link } from 'react-router-dom'
import Header from "./Header"
import "../css/aniadirAlumno.css"
import axios from "axios"

import { ACCESS_LEVEL_GUEST, SERVER_HOST } from "../config/global_constants"

export default class Register extends Component {

    constructor(props) {
        super(props)

        this.state = {
            usuario: '',
            correo: '',
            contra: '',
            confirmPassword: '',
            userType: 'student',
            nombre: '',
            dni: '',
            tipo: 0,
            telefono: '',
            fechaNacimineto: '',
            clase: '',
            foto: null,
            tried: false,
            redirect: false,
            userExitsError: false,
            errorMessage: ''
        }

    }

    componentDidMount() {
        this.inputToFocus.focus()
    }

    validateUsuario() {
        if (this.state.usuario === "") {
            return false
        } else {
            return true
        }
    }

    validateNombre() {
        if (this.state.nombre === "") {
            return false
        } else {
            return true
        }
    }

    validateDni() {
        if (this.state.dni === "") {
            return false
        } else {
            return true
        }
    }

    validatTelefono() {
        if (this.state.telefono === "") {
            return false
        } else {
            return true
        }
    }

    validateCorreo() {
        //this is from internet
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(this.state.correo).toLowerCase());
    }

    validateContra() {
        if(this.state.contra === '')
            return false
        else
            return true
    }

    validateConfirmPassword() {
        //if the states of passwords are the same, it means its all ok
        if (this.state.confirmPassword === "") {
            return false
        }
        if (this.state.contra === this.state.confirmPassword)
            return true
        else
            return false
    }

    validateTelefono(){
        if(this.state.telefono === '')
            return false
        else
            return true
    }

    validateFechaNacimiento() {
        var parts = this.state.fechaNacimineto.split('/')
        var date = new Date(parts[2], parts[1] - 1, parts[0])
        return date instanceof Date && !isNaN(date.getTime())
    }

    validateFoto(){
        if(this.state.foto === null)
            return false
        else
            return true
    }

    validation() {
        //creamos un objeto 
        return {
            usuario: this.validateUsuario(),
            correo: this.validateCorreo(),
            contra: this.validateContra(),
            confirmPassword: this.validateConfirmPassword(),
            nombre: this.validateNombre(),
            dni: this.validateDni(),
            telefono: this.validateTelefono(),
            fechaNacimineto: this.validateFechaNacimiento(),
            foto: this.validateFoto()
        }
    }

    validationTrue() {
        //creamos un objeto 
        return {
            usuario: true,
            correo: true,
            contra: true,
            confirmPassword: true,
            nombre: true,
            dni: true,
            telefono: true,
            fechaNacimineto: true,
            foto: true
        }

    }


    handleChange = e => {

        this.setState({ [e.target.name]: e.target.value })
    }
    handleFileChange = (e) => 
    {
        this.setState({foto: e.target.files})
    }

    addUser = e => {

        

        //clientSide validation
        const mailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|("."))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const formInputsState = this.validation()
        const inputsAreAllValid = Object.keys(formInputsState).every(index => formInputsState[index])

        //Fecha
        var parts = this.state.fechaNacimineto.split('/')
        var date = new Date(parts[2], parts[1] - 1, parts[0])
        console.log(date)        


        if(!inputsAreAllValid){
            this.setState({tried: true})
        } else {
            //we encode the pass for cases with especial character
            let encodedPass = encodeURIComponent(this.state.contra)
            const fotos = [...this.state.foto]

            //we create the formData that will be passed to the server
            var bodyFormData = new FormData();
            bodyFormData.append('usuario', this.state.usuario)
            bodyFormData.append('correo', this.state.correo)
            bodyFormData.append('dni', this.state.dni)
            bodyFormData.append('telefono', this.state.telefono)
            bodyFormData.append('contra', encodedPass)
            bodyFormData.append('nombre', this.state.nombre)
            bodyFormData.append('fechaNacimiento', date)
            bodyFormData.append('clase', this.state.clase)
            bodyFormData.append('tipo', this.state.tipo)
            bodyFormData.append('foto', fotos[0])

            axios({
                method: "post",
                url: `${SERVER_HOST}/Users/register/${this.state.userType}`,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            }).then(res => {
                //handle success


                this.setState({ redirect: !this.state.redirect })
            }).catch(err => {
                //handle error

                this.setState({ userExitsError: !this.state.userExitsError, errorMessage: 'El nombre de usuario no está disponible' })
            })
        }
    }

    cancelUser = e => {
        this.setState({ redirect: !this.state.redirect })
    }

    render() {

        let formInputsState

        //errors
        let emailErrorMessage = <div className="error">Introduce un email valido</div>
        let passwordConfirmErrorMessge = <div className="error">Las contraseñas no coinciden</div>
        let empty = <div className="error">Rellene el campo</div>
        let emptyFile = <div className="error">Suba un archivo</div>
        let invalidDate = <div className="error">Formato: dd/mm/aaaa</div>

        {this.state.tried? 
            formInputsState = this.validation()
            : formInputsState = this.validationTrue()
        }

        return (
            <div id="registerWeb" className="Body">
                <Header />
                <form>
                    {this.state.redirect ? <Redirect to="/Register" /> : null}
                    <div className="botonesContainer">
                        {this.state.userExitsError ? <div className="error">{this.state.errorMessage}</div> : null}

                        <div className="item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="userName"
                                type="text"
                                name="usuario" placeholder="Nombre de Usuario"
                                onChange={this.handleChange} ref={input => { this.inputToFocus = input }} />
                        </div>
                        {formInputsState.usuario ? "" : empty}

                        <div className="item-container">

                            <input className={"form-control" ? "" : "error"}
                                id="password"
                                type="password"
                                name="contra" placeholder="Contraseña"
                                onChange={this.handleChange} />
                        </div>
                        {formInputsState.contra ? "" : empty}

                        <div className="item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword" placeholder="Confirma Contraseña"
                                onChange={this.handleChange} />
                        </div>
                        {formInputsState.confirmPassword ? "" : passwordConfirmErrorMessge}
                        <div className="item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="name"
                                type="text"
                                name="nombre" placeholder="Nombre Completo"
                                onChange={this.handleChange} />
                        </div>
                        {formInputsState.nombre ? "" : empty}
                        <div className="item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="id"
                                type="text"
                                name="dni" placeholder="DNI"
                                onChange={this.handleChange} />
                        </div>
                        {formInputsState.dni ? "" : empty}
                        <div className="item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="email"
                                type="text"
                                name="correo" placeholder="Correo electrónico"
                                onChange={this.handleChange} />
                        </div>
                        {formInputsState.correo ? "" : emailErrorMessage}
                        <div className="item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="phoneNumber"
                                type="text"
                                name="telefono" placeholder="Teléfono"
                                onChange={this.handleChange} />
                        </div>
                        {formInputsState.dni ? "" : empty}
                        {/* Esto solo se muestran si es un estudiante */}
                        {this.state.userType === 'student' ?
                            <div className="studentItems">
                                <div className="item-container">
                                    <label className="user-type--labeled">
                                        <p>Tipo:</p>
                                        <div className="customSelect">
                                            <select className="form-control" name="tipo" defaultValue="0" onChange={this.handleChange}>
                                                <option value="1">Pictogramas + Texto</option>
                                                <option value="0">Texto</option>
                                            </select>
                                        </div>
                                    </label>
                                </div>
                                <div className="item-container">
                                    <input className={"form-control" ? "" : "error"}
                                        id="birthdate"
                                        type="text"
                                        name="fechaNacimineto" placeholder="dd/mm/aaaa"
                                        onChange={this.handleChange} />
                                </div>
                                {formInputsState.fechaNacimineto ? "" : invalidDate}
                                <div className="item-container">
                                    <input className={"form-control" ? "" : "error"}
                                        id="class"
                                        type="text"
                                        name="clase" placeholder="Curso"
                                        onChange={this.handleChange} />
                                </div>
                                {formInputsState.dni ? "" : empty}
                                <div className="sub-item-container">
                                    <input type="file" id="uploadedImage" name="foto" onChange = {this.handleFileChange} accept="image/png"/>
                                </div> <br/>
                                {formInputsState.foto ? "" : emptyFile}
                            </div> : null}

                        <div className="register-buttons">
                        
                            <div>
                                <input type="button" className="green-button" value="Añadir usuario"  onClick={this.addUser} />
                            </div>
                        </div>

                    </div>
            
                </form >
            </div>
        )
    }
}