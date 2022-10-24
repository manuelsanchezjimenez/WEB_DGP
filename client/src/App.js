import React, { Component } from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"

import "bootstrap/dist/css/bootstrap.css"
import "./css/App.css"
import LoggedInRouteTeacher from "./components/LoggedInRouteTeacher"
import LoggedInRouteAdmin from "./components/LoggedInRouteAdmin"
import LogIn from "./components/LogIn"
import LogOut from "./components/LogOut"
import LogInCheck from "./components/LogInCheck"
import HomeTeacher from "./components/HomeTeacher"
import HomeAdmin from "./components/HomeAdmin"
import Header from "./components/Header"
import AdminAlumPrincipal from "./components/AdminAlumPrincipal"

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={LogInCheck} />
                    <Route exact path="/LogIn" component={LogIn} />
                    <Route exact path="/Header" component={Header} />
                    <LoggedInRouteTeacher exact path="/LogOut" component={LogOut} />
                    <LoggedInRouteTeacher exact path="/HomeTeacher" component={HomeTeacher} />
                    <LoggedInRouteAdmin exact path="/HomeAdmin" component={HomeAdmin} />
                    <Route exact path="/AdminAlumPrincipal" component={AdminAlumPrincipal} />
                    <Route path="*" component={() => <h3>URL invalida. Esta página web no existe</h3>} />
                </Switch>
            </BrowserRouter>
        )
    }
}