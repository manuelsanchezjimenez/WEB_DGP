import React, { Component } from "react"

import { Redirect, Link } from 'react-router-dom'

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
            userType: 'teacher',
            nombre: '',
            dni: '',
            tipo: 0, 
            telefono: '',
            fechaNacimineto: '',
            clase: '',
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
        //we can make these more complex using ifs.
        /* if (this.state.contra.length < 10 || !/[A-Z]/.test(this.state.contra) || !/[a-z]/.test(this.state.contra) || !/[0-9]/.test(this.state.contra)
            || !/[£!#€$%^&*]/.test(this.state.contra)) {
            return false
        } else {
            return true
        } */
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

    validateFechaNacimiento() {
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
            telefono: this.validatTelefono(),
            fechaNacimineto: this.validateFechaNacimiento()
        }

    }


    handleChange = e => {

        this.setState({ [e.target.name]: e.target.value })

    }

    addUser = e => {

        //clientSide validation
        const mailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|("."))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        //const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/

        var parts =this.state.fechaNacimineto.split('/')
        var date = new Date(parts[2], parts[1] - 1, parts[0])
        console.log(date)

        if (!this.state.correo.match(mailPattern)) {
            console.log('Email must be valid')
        } /* else if (!this.state.contra.match(passwordPattern)) {
            console.log('Password must have at least 6 characters, 1 number and 1 especial character.')
        } */ else if (!this.state.confirmPassword.match(this.state.contra)) {
            console.log('Passwords must match.')
        } else {
            //we encode the pass for cases with especial character
            let encodedPass = encodeURIComponent(this.state.password)

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



            console.log(bodyFormData)

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
            });
        }
    }

    cancelUser = e => {
        this.setState({ redirect: !this.state.redirect })
    }

    render() {

        let errorList = []
        if (this.state.contra.length < 10) {
            errorList.push({ id: 1, msg: "Password must be 10 digits long." })
        }
        if (!/[0-9]/.test(this.state.contra)) {
            errorList.push({ id: 2, msg: "Password must contain a digit." })
        }
        if (!/[A-Z]/.test(this.state.contra)) {
            errorList.push({ id: 3, msg: "Password must contain an uppercase." })
        }
        if (!/[a-z]/.test(this.state.contra)) {
            errorList.push({ id: 4, msg: "Password must contain an lowercase." })
        }
        if (!/[£!#€$%^&*]/.test(this.state.contra)) {
            errorList.push({ id: 5, msg: "Password must contain a special digit [£!#€$%^&*]." })
        }

        //errors
        let nameEmpty = <div className="error">Enter a name<br /></div>
        let emailErrorMessage = <div className="error">Enter a valid email<br /></div>
        let emailEmpty = <div className="error">Email is empty.<br /></div>
        //let passwordErrorMessge = <div className="error"><ul> {errorList.map(error => <li key={error.id}> {error.msg} </li>)}</ul></div>
        let passwordConfirmErrorMessge = <div className="error">Passwords doesn't match<br /></div>
        let empty = <div className="error">Rellene el campo</div>
        let invalidDate = <div className="error">Formato: dd/mm/aaaa</div>
        const formInputsState = this.validation()
        const inputsAreAllValid = Object.keys(formInputsState).every(index => formInputsState[index])

        return (

            <div id="registerWeb" className="web-container">
                {this.state.redirect ? <Redirect to="/Register" /> : null}
             
                <div className="register-form-container">
                    {this.state.userExitsError ? <div className="errorDiv">{this.state.errorMessage}</div> : null}

                    <div className="item-container">
                        <input className={"form-control" ? "" : "error"}
                            id="userName"
                            type="text"
                            name="usuario" placeholder="Nombre de Usuario"
                            onChange={this.handleChange} ref={input => { this.inputToFocus = input }} />
                    </div>
                    {formInputsState.usuario ? "" : nameEmpty}

                    <div className="item-container">
                        <div className="sub-item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="password"
                                type="password"
                                name="contra" placeholder="Contraseña"
                                onChange={this.handleChange} />
                            {formInputsState.contra ? "" : empty}
                        </div>

                        <div className="sub-item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword" placeholder="Confirma Contraseña"
                                onChange={this.handleChange} />
                            {formInputsState.confirmPassword ? "" : passwordConfirmErrorMessge}<br />
                        </div>
                    </div>

                    <div className="item-container">
                        <div className="sub-item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="name"
                                type="text"
                                name="nombre" placeholder="Nombre Completo"
                                onChange={this.handleChange} />
                        </div>

                        <div className="sub-item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="id"
                                type="text"
                                name="dni" placeholder="DNI"
                                onChange={this.handleChange} />
                        </div>
                    </div>

                    <div className="item-container">
                        <label className="user-type--labeled">
                            <p>Tipo:</p>
                            <div className="customSelect">
                                <select className="form-control" name="userType" defaultValue="teacher" onChange={this.handleChange}>
                                    <option value="teacher">Profesor</option>
                                    <option value="admin">Administrador</option>
                                    <option value="student">Estudiante</option>
                                </select>
                            </div>
                        </label>
                    </div>

                    <div className="item-container">
                        <div className="sub-item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="email"
                                type="text"
                                name="correo" placeholder="Correo electrónico"
                                onChange={this.handleChange} />
                            {this.state.correo === "" ? emailEmpty : formInputsState.correo ? "" : emailErrorMessage}
                        </div>
                        <div className="sub-item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="phoneNumber"
                                type="text"
                                name="telefono" placeholder="Teléfono"
                                onChange={this.handleChange} />
                        </div>
                    </div>
                    {/* Esto solo se muestran si es un estudiante */}
                    {this.state.userType === 'student' ? 
                    <div className="studentItems">
                        <div className="item-container">
                            <label className="user-type--labeled">
                                <p>Tipo:</p>
                                <div className="customSelect">
                                    <select className="form-control" name="tipo" defaultValue="0" onChange={this.handleChange}>
                                        <option value="2">Pictogramas</option>
                                        <option value="1">Pictogramas + Texto</option>
                                        <option value="0">Texto</option>
                                    </select>
                                </div>
                            </label>
                        </div>
                        <div className="item-container">
                            <div className="sub-item-container">
                                <input className={"form-control" ? "" : "error"}
                                    id="birthdate"
                                    type="text"
                                    name="fechaNacimineto" placeholder="dd/mm/aaaa"
                                    onChange={this.handleChange} />
                                {this.state.fechaNacimineto === "" ? empty : formInputsState.fechaNacimineto ? "" : invalidDate}
                            </div>
                            <div className="sub-item-container">
                                <input className={"form-control" ? "" : "error"}
                                    id="class"
                                    type="text"
                                    name="clase" placeholder="Curso"
                                    onChange={this.handleChange} />
                            </div>
                        </div>
                    </div>   : null}

                    <div className="register-buttons">
                        <div>
                            <Link className="red-button" to="/LogInForm"> Cancel </Link>
                        </div>
                        <div>
                            <input type="button" className="green-button" value="Añadir usuario" disabled={!inputsAreAllValid} onClick={this.addUser} />
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}