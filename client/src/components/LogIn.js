import React, {Component} from "react"

import {Redirect, Link} from 'react-router-dom'

import axios from "axios"

import {ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"

import {ACCESS_LEVEL_GUEST} from "../config/global_constants"

export default class LogIn extends Component 
{

    constructor(props) 
    {
        super(props)

        this.state = {
            user: '',
            password: '',
            redirectTeacher:false,
            redirectAdmin:false,
            logInError: false,
            errorMessage: ''
        }

    }

    componentDidMount(){
        localStorage.clear()
        localStorage.usuario = 'GUEST'
        localStorage.accessLevel = ACCESS_LEVEL_GUEST
    }

    validateUser(){
        if(this.state.user){
            return true
        }else{
            return false
        }
    }


    
    validatePassword() {
        if(this.state.password){
                return true
            }else{
                return false
            }
    }

    validation(){
        return {
            user: this.validateUser(),
            password: this.validatePassword()
        }

    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    logInUser = e => {  
        localStorage.usuario = "GUEST"
        localStorage.accessLevel = ACCESS_LEVEL_GUEST 
        let encodedPass = encodeURIComponent(this.state.password) //encoding needed to avoid especial chars in the url

        var bodyFormData = new FormData();
        bodyFormData.append('usuario', this.state.user)
        bodyFormData.append('contra', encodedPass)

        axios({
            method: "post",
            url: `${SERVER_HOST}/Users/login`,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        }).then(res => {
            //handle success
            localStorage.usuario = res.data.usuario
            localStorage.accessLevel = res.data.accessLevel
            localStorage.token = res.data.token

            if(res.data.accessLevel === ACCESS_LEVEL_ADMIN){
                this.setState({redirectAdmin:true})
            }else{
                this.setState({redirectTeacher:true})
            }
        }).catch(err => {
            //handle error
            localStorage.usuario = "GUEST"
            localStorage.accessLevel = ACCESS_LEVEL_GUEST
            this.setState({logInError: true, errorMessage: 'Error, las credenciales no concuerdan.'})
        });
    }

    render() 
    {   

        const formInputsState = this.validation()
        const inputsAreAllValid = Object.keys(formInputsState).every(index => formInputsState[index]) 

        return (      
            
            <div className="web-container">
                {this.state.redirectTeacher ? <Redirect to="/HomeTeacher"/> : null}
                {this.state.redirectAdmin ? <Redirect to="/HomeAdmin"/> : null}
                <div className="login-container">
                    <div className="logo-container">
                        <img id="bigSizeLogo" src={require("../images/logo.png")} alt="Logo San Rafael"/>
                    </div>

                    <div className="form-container">
                        {this.state.logInError ? <div className="error">{this.state.errorMessage}</div> : null}
                        <input className="form-control" id="user" type="text" name="user" placeholder="Usuario" onChange={this.handleChange}/><br/>
                        <input className="form-control" id="password" type="password" name="password"  placeholder="Contraseña" onChange={this.handleChange}/><br/>  
                    </div>

                    <div className="button-container">
                        <div className="center-button">
                            <input id="loginButton" type="button" className="white-button" value="Acceder" disabled = {!inputsAreAllValid} onClick={this.logInUser}/>
                        </div> 
                    </div>
                </div>
            </div> 
        )
    }
}