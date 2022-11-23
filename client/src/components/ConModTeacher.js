import React, {Component} from "react"
import Header from "./Header"

import {Redirect, Link} from 'react-router-dom'

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
            nombreMostrar: '',
            usuario: '',
            id_t: '',
            contra: '',
            redirect: false,
            mounted: false
        }

    }
    componentDidMount = () =>{
        //axios.get(`${SERVER_HOST}/Users/teacher/${this.props.match.params.id}`,{headers:{"authorization":localStorage.token}})
        axios.get(`${SERVER_HOST}/Users/teacher/63761ae26dd49f09705c38b1`,{headers:{"authorization":localStorage.token}})
        .then(res => 
        {     
            if(res.data)
                if (res.data.errorMessage)
                    console.log(res.data.errorMessage)  
                else{
                    this.setState({nombre: res.data.usuario.nombre})
                    this.setState({nombreMostrar: res.data.usuario.nombre})
                    this.setState({usuario: res.data.usuario.usuario})
                    this.setState({id_t: res.data.usuario._id})
                    this.setState({mounted: true})
                }  

        }).catch(error =>{
            console.log("err:" + error.response.data)
        })         
    }

    updateProfile = () =>{
        const data = {nombre: this.state.nombre, usuario: this.state.usuario, id: this.state.id_t, contra: this.state.contra} 
        axios.put(`${SERVER_HOST}/Users/profile/teacher`, data, {headers:{"authorization":localStorage.token}})
        .then(res => 
        {     
            if(res.data)
                if (res.data.errorMessage)
                    console.log(res.data.errorMessage)  
                else
                    this.setState({redirect: true})  

        }).catch(error =>{
            console.log("err:" + error.response.data)
        })  
    }

    deleteProfile = () =>{
        axios.delete(`${SERVER_HOST}/Users/delete/teacher/${this.state.id_t}`, {headers:{"authorization":localStorage.token}})
        .then(res => 
        {     
            if(res.data)
                if (res.data.errorMessage)
                    console.log(res.data.errorMessage) 
                else
                    this.setState({redirect: true})   

        }).catch(error =>{
            console.log("err:" + error.response.data)
        })  
    }

    handleChange = e => {

        this.setState({ [e.target.name]: e.target.value })

    }

    allFilled = () =>{
        if(this.state.nombre !== '' && this.state.usuario !== '')
            return false
        else
            return true
    }
    render() 
    {   
        return (       
            <div className="web-container"> 
            {this.state.redirect ? <Redirect to="/HomeAdmin"/> : null}
                <div className="content-container">
                    <h1>Consulta y Modificación: {this.state.nombreMostrar}</h1>
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
                                    type="text"
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

                        </div>
                        <div id="buttons">
                            <input type="button" className="green-button" value="Modificar Datos" disabled={this.allFilled()} onClick={this.updateProfile}/>
                            <input type="button" className="red-button" value="Eliminar Profesor" onClick={this.deleteProfile}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}