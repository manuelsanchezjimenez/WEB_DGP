import React, {Component} from "react"
import Header from "./Header"

import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"
import "../css/ConModTeacher.css"

//<Link className="blue-button" to={{pathname: `ConModTeacher/${this.state.id}`}}> Modify </Link>


export default class ConModTeacher extends Component 
{
    constructor(props){
        super(props)

        this.state = {
            nombre: '',
            usuario: '',
            id_t: '635b8e221cbc538d118b0caf',
            contra: '',
            correo: '',
            telefono: '',
            dni: '',
            mounted: false
        }

    }
    componentDidMount = () =>{
        axios.get(`${SERVER_HOST}/Users/teacher/635b8e221cbc538d118b0caf`,{headers:{"authorization":localStorage.token}})
        //axios.get(`${SERVER_HOST}/Users/teacher/${this.props.match.params.id}`,{headers:{"authorization":localStorage.token}})
        .then(res => 
        {     
            if(res.data)
                if (res.data.errorMessage)
                    console.log(res.data.errorMessage)  
                else{
                    console.log(res.data)
                    this.setState({nombre: res.data.usuario.nombre})
                    this.setState({usuario: res.data.usuario.usuario})
                    this.setState({id: res.data.usuario.id})
                    this.setState({contra: res.data.usuario.contra})
                    this.setState({correo: res.data.usuario.correo})
                    this.setState({telefono: res.data.usuario.telefono})
                    this.setState({dni: res.data.usuario.dni})
                    this.setState({mounted: true})
                }  

        }).catch(error =>{
            console.log("err:" + error.response.data)
        })         
    }

    updateProfile = () =>{
        const data = {nombre: this.state.nombre, usuario: this.state.usuario, id: this.state.id_t, contra: this.state.contra, correo: this.state.correo, telefono: this.state.telefono, dni: this.state.dni} 
        console.log(data)
        axios.put(`${SERVER_HOST}/Users/profile/teacher`, data, {headers:{"authorization":localStorage.token}})
        .then(res => 
        {     
            if(res.data)
                if (res.data.errorMessage)
                    console.log(res.data.errorMessage)    

        }).catch(error =>{
            console.log("err:" + error.response.data)
        })  
    }

    handleChange = e => {

        this.setState({ [e.target.name]: e.target.value })

    }

    allFilled = () =>{
        if(this.state.nombre !== '' && this.state.usuario !== '' && this.state.contra !== '')
            return false
        else
            return true
    }
    render() 
    {   
        return (       
            <div className="web-container"> 
                <div className="content-container">
                    <h1>Consulta y Modificación: {this.state.nombre}</h1>
                    <div className="profile"> 
                        <div className="item-container">
                            <div className="sub-item-container">
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
                                    type="password"
                                    name="contra" placeholder="Contraseña"
                                    value={this.state.contra}
                                    onChange={this.handleChange} />
                            </div>                         
                        </div>
                        <div className="item-container">
                            <div className="sub-item-container">
                                <input className={"form-control" ? "" : "error"}
                                    id="name"
                                    type="text"
                                    name="nombre" placeholder="Nombre Completo"
                                    value={this.state.nombre}
                                    onChange={this.handleChange} />
                            </div>
                            <div className="sub-item-container">
                                <input className={"form-control" ? "" : "error"}
                                    id="dni"
                                    type="text"
                                    name="dni" placeholder="DNI"
                                    value={this.state.dni}
                                    onChange={this.handleChange} />
                            </div>
                            <div className="sub-item-container">
                                <input className={"form-control" ? "" : "error"}
                                    id="correo"
                                    type="text"
                                    name="correo" placeholder="Correo Electrónico"
                                    value={this.state.correo}
                                    onChange={this.handleChange} />
                            </div>
                            <div className="sub-item-container">
                                <input className={"form-control" ? "" : "error"}
                                    id="telefono"
                                    type="text"
                                    name="telefono" placeholder="Nº Teléfono"
                                    value={this.state.telefono}
                                    onChange={this.handleChange} />
                            </div>

                        </div>
                        <div id="buttons">
                            <input type="button" className="green-button" value="Modificar Datos" disabled={this.allFilled()} onClick={this.updateProfile}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}