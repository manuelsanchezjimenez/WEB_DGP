import axios from "axios"
import React, {Component} from "react"
import {Link} from 'react-router-dom'
import {SERVER_HOST} from "../config/global_constants"

export default class HomeTeacher extends Component 
{

    constructor(props) 
    {
        super(props)

        this.state = { 
            mounted: false
        }
    }

    render(){
        return(<div></div>)
    }


}