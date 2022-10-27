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
import AdminAlumPrincipal from "./components/AdminAlumPrincipal"
import ListaTareasFijas from "./components/ListaTareasFijas"
import AddTareaFija from "./components/AddTareaFija"
import ConModTeacher from "./components/ConModTeacher"

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={LogInCheck} />
                    <Route exact path="/LogIn" component={LogIn} />
                    <LoggedInRouteTeacher exact path="/LogOut" component={LogOut} />
                    <LoggedInRouteTeacher exact path="/HomeTeacher" component={HomeTeacher} />
                    <LoggedInRouteAdmin exact path="/HomeAdmin" component={HomeAdmin} />
                    <LoggedInRouteAdmin exact path="/ConModTeacher" component={ConModTeacher} />
                    <Route exact path="/AdminAlumPrincipal" component={AdminAlumPrincipal} />
                    <Route exact path="/ListaTareasFijas" component={ListaTareasFijas} />
                    <Route exact path="/AddTareaFija" component={AddTareaFija} />
                    <Route path="*" component={() => <h3>URL invalida. Esta página web no existe</h3>} />
                </Switch>
            </BrowserRouter>
        )
    }
}