import axios from "axios"
import React, {Component} from "react"
import {Link} from 'react-router-dom'
import Header  from "./Header"
import {SERVER_HOST} from "../config/global_constants"
import "../css/HomeAdmin.css"

export default class HomeAdmin extends Component 
{

    constructor(props) 
    {
        super(props)

        this.state = { 
            mounted: false
        }
    }

    render(){
        return(
            <div className="Body">
                <Header/>
                <div className="botonesContainer">
                <Link to="/AdminAlumPrincipal"><input id="alumnos" type="button" className="botonPrincipal" value="Alumnos"/></Link>
                <input id="Profesores" type="button" className="botonPrincipal" value="Profesores" />
                <input id="administradores" type="button" className="botonPrincipal" value="ADMINISTRADORES" />
                <Link to="/ListaTareas"><input id="tareas" type="button" className="botonPrincipal" value="TAREAS"/></Link>
                </div>
                {/*<Link className="red-button" to="/tenantHome"> Cancel Rental</Link>*/}
            </div>
            );
    }

}