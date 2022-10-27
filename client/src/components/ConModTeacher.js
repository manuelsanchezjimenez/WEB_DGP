import React, {Component} from "react"
import Header from "./Header"

import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"

export default class ConModTeacher extends Component 
{
    constructor(props){
        super(props)

        this.state = {
            nombre: '',
            usuario: '',
            id: '',
            contra: '',
            mounted: false
        }

    }
    componentDidMount = () =>{
        axios.get(`${SERVER_HOST}/Users/teacher`, {headers:{"authorization":localStorage.token}})
        .then(res => 
        {     
            if(res.data)
                if (res.data.errorMessage)
                    console.log(res.data.errorMessage)  
                else{
                    console.log(res.data)
                    this.setState({nombre: res.data.user.nombre})
                    this.setState({usuario: res.data.user.usuario})
                    this.setState({_id: res.data.user.id})
                    this.setState({contra: res.data.user.contra})
                    this.setState({mounted: true})
                }  

        }).catch(error =>{
            console.log("err:" + error.response.data)
        })         
    }

    updateProfile = () =>{
        const data = {nombre: this.state.nombre, usuario: this.state.usuario, _id: this.state.id, contra: this.state.contra} 
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
                    <h1>Consulta y Modificación: Profesor</h1>
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