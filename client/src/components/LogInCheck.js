import React, {Component} from "react"
import {Redirect} from 'react-router-dom'

import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN} from "../config/global_constants"

export default class LogInCheck extends Component 
{

    constructor(props) 
    {
        super(props)
        
        this.state = {
            redirectTeacher: false,
            redirectAdmin: false,
            redirectLogIn: false,
        }
    }

    componentDidMount() {
        if (typeof localStorage.accessLevel === "undefined" || !localStorage.token || localStorage.accessLevel == ACCESS_LEVEL_GUEST)
        {
            localStorage.clear()
            localStorage.email = "GUEST"
            localStorage.accessLevel = ACCESS_LEVEL_GUEST
            this.setState({redirectLogIn:true})
            //localStorage.token = null 
        }else{
            axios({
                method: "get",
                url: `${SERVER_HOST}/Users/LogInCheck`,
                headers: { "authorization": localStorage.token },
            }).then(res => {
                //handle success
                localStorage.usuario = res.data.user
                localStorage.accessLevel = res.data.accessLevel
                localStorage.token = res.data.token

                if(res.data.accessLevel === ACCESS_LEVEL_ADMIN){
                    this.setState({redirectAdmin:true})
                }else{
                    this.setState({redirectTeacher:true})
                }
            }).catch(err => {
                //handle error
                localStorage.clear()
                localStorage.email = "GUEST"
                localStorage.accessLevel = ACCESS_LEVEL_GUEST
                this.setState({redirectLogIn:true})
            });
        }
    }

    render() 
    {   
        return (   
            <div>
                {this.state.redirectAdmin ? <Redirect to="/HomeAdmin"/> : null}
                {this.state.redirectTeacher ? <Redirect to="/HomeTeacher"/> : null}
                {this.state.redirectLogIn ? <Redirect to="/LogIn"/> : null}
            </div>
        )
    }
}