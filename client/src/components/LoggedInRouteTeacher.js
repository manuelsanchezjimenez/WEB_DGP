import React from 'react'
import {Route, Redirect } from "react-router-dom"

import {ACCESS_LEVEL_TEACHER} from "../config/global_constants"


const LoggedInRouteTeacher = ({component: Component, exact, path, ...rest }) => 
(
    <Route
        exact = {exact}
        path = {path}
        render = {props => localStorage.accessLevel >= ACCESS_LEVEL_TEACHER && localStorage.token? <Component {...props} {...rest} /> : <Redirect to="/LogIn"/> }
    />
)

export default LoggedInRouteTeacher