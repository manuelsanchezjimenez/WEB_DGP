import axios from "axios"
import React, { Component } from "react"
import { Link } from 'react-router-dom'
import Header from "./Header"
import { SERVER_HOST } from "../config/global_constants"
import "../css/aniadirAlumno.css"

export default class aniadirAlumno extends Component {

    constructor(props) {
        super(props)

        this.state = {
            usuario: '',
            correo: '',
            contra: '',
            userType: 'alumno',
            nombre: '',
            dni: '',
            tipo: 0, 
            telefono: '',
            fechaNacimineto: null,
            clase: '',
            profesor: '',
            actividad: '',
            redirect: false,
            userExitsError: false,
            errorMessage: ''
            
        }
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

    validation() {
        //creamos un objeto 
        return {
            usuario: this.validateUsuario(),
            correo: this.validateCorreo(),
            contra: this.validateContra(),
            confirmPassword: this.validateConfirmPassword(),
            nombre: this.validateNombre(),
            dni: this.validateDni(),
            telefono: this.validatTelefono()
        }

    }


    handleChange = e => {

        this.setState({ [e.target.name]: e.target.value })

    }

    addUser = e => {

        //clientSide validation
        const mailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|("."))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/

        if (!this.state.correo.match(mailPattern)) {
            console.log('Email must be valid')
        } else if (!this.state.contra.match(passwordPattern)) {
            console.log('Password must have at least 6 characters, 1 number and 1 especial character.')
        } else if (!this.state.confirmPassword.match(this.state.contra)) {
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
        let nameEmpty = <div className="error">Introduce un nombre de usuario<br /></div>
        let contraEmpty = <div className="error">Introduce una contraseña<br /></div>
        let emailErrorMessage = <div className="error">Introduce un Email valido<br /></div>
        let emailEmpty = <div className="error">Email vacío.<br /></div>
        let passwordErrorMessge = <div className="error"><ul> {errorList.map(error => <li key={error.id}> {error.msg} </li>)}</ul></div>
        let passwordConfirmErrorMessge = <div className="error">Las contraseñas no coinciden <br /></div>
        let empty = <div className="error">Rellene el campo</div>
        const formInputsState = this.validation()
        const inputsAreAllValid = Object.keys(formInputsState).every(index => formInputsState[index])
        return (
            
            <div className="Body">
                <Header />
                <div className="botonesContainer">
                    <form>
                    <h1>Registro Alumnos</h1>
                    
                    {this.state.userExitsError ? <div className="errorDiv">{this.state.errorMessage}</div> : null}
                         <label>
                            <input type="text" name="usuario" placeholder="Usuario" id="userName"
                            onChange={this.handleChange} ref={input => { this.inputToFocus = input }}/>
                            {formInputsState.usuario ? "" : nameEmpty}
                        </label>
                        <label>
                            <input type="text"/*className={"form-control" ? "" : "error"}*/ name="contraseña" placeholder="Contraseña" onChange={this.handleChange} ref={input => { this.inputToFocus = input }}/>
                            {formInputsState.contra ? "" : empty}
                        </label>
                        <label>
                         <input className={"form-control" ? "" : "error"} name="contraseña2" placeholder="Repite contraseña" onChange={this.handleChange}/>
                         {formInputsState.confirmPassword ? "" : passwordConfirmErrorMessge}
                        </label>
                        <label>
                            <input className={"form-control" ? "" : "error"} name="nombre" placeholder="Nombre" onChange={this.handleChange}/>
                            
                        </label>
                        <label>
                            <input className={"form-control" ? "" : "error"} name="apellidos" placeholder="Apellidos" onChange={this.handleChange}/>
                        </label>
                        <label>
                            <input className={"form-control" ? "" : "error"} name="DNI" placeholder="DNI" onChange={this.handleChange}/>
                        </label>
                        <label>
                            <input className={"form-control" ? "" : "error"} name="EMAIL" placeholder="Email" onChange={this.handleChange}/>
                            {this.state.correo === "" ? emailEmpty : formInputsState.correo ? "" : emailErrorMessage}

                        </label>
                        <label>
                            FECHA NACIMIENTO
                            <input type="date" name="clase" placeholder="Clase" onChange={this.handleChange}/>
                        </label>
                        <label>
                            Tipo Visualizacion   
                            <select>
                                <option value="0" >Texto</option>
                                <option value="1" >Pictogramas + Texto </option>
                                <option value="2" >Texto </option>
                            </select>
                        </label>
                        <div>
                            <input type="button" className="green-button" value="Añadir usuario" disabled={!inputsAreAllValid} onClick={this.addUser} />
                        </div>
                    </form>
                </div>
                {/*<Link className="red-button" to="/tenantHome"> Cancel Rental</Link>*/}
            </div>
        );
    }

}