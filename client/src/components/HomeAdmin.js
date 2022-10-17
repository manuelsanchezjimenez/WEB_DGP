import axios from "axios"
import React, {Component} from "react"
import {Link} from 'react-router-dom'
import {SERVER_HOST} from "../config/global_constants"

export default class HomeAdmin extends Component 
{

    constructor(props) 
    {
        super(props)

        this.state = { 
            mounted: false
        }
    }

}