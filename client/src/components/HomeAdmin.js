import axios from "axios"
import React, { Component } from "react"
import { Link } from 'react-router-dom'
import Header from "./Header"
import { SERVER_HOST } from "../config/global_constants"
import "../css/HomeAdmin.css"

export default class HomeAdmin extends Component {

    constructor(props) {
        super(props)

        this.state = {
            mounted: false
        }
    }

    render() {
        return (
            <div className="Body">
                <Header />
                <div className="botonesContainer">
                    <Link to="/AdminAlumPrincipal"><input id="alumnos" type="button" className="botonPrincipal" value="Alumnos" /></Link>
                    <Link to="/AdminProfPrincipal"><input id="Profesores" type="button" className="botonPrincipal" value="Profesores" /></Link>
                    <Link to="/AdminAdminPrincipal"><input id="administradores" type="button" className="botonPrincipal" value="Administradores" /></Link>
                    <Link to="/ListaTareas"><input id="tareas" type="button" className="botonPrincipal" value="Tareas" /></Link>
                </div>
                {/*<Link className="red-button" to="/tenantHome"> Cancel Rental</Link>*/}
            </div>
        );
    }

}