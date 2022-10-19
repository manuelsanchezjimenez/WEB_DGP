import React, { Component } from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"

import "bootstrap/dist/css/bootstrap.css"
import "./css/App.css"
import LoggedInRoute from "./components/LoggedInRoute"
import LogIn from "./components/LogIn"
import LogOut from "./components/LogOut"
import LogInCheck from "./components/LogInCheck"
import HomeTeacher from "./components/HomeTeacher"
import HomeAdmin from "./components/HomeAdmin"

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={LogInCheck} />
                    <Route exact path="/LogIn" component={LogIn} />
                    <LoggedInRoute exact path="/LogOut" component={LogOut} />
                    <LoggedInRoute exact path="/HomeTeacher" component={HomeTeacher} />
                    <LoggedInRoute exact path="/HomeAdmin" component={HomeAdmin} />
                    <Route path="*" component={() => <h3>URL invalida. Esta página web no existe</h3>} />
                </Switch>
            </BrowserRouter>
        )
    }
}