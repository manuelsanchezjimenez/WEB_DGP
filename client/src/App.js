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
import AddActividad from "./components/AddActividad"
import ListaActividades from "./components/ListaActividades"
import ModActividad from "./components/ModActividad"
import ListaTareas from "./components/ListaTareas"
import Register from "./components/Register"
import ConModStudent from "./components/ConModStudent"
import ConModTeacher from "./components/ConModTeacher"
import ConModAdmin from "./components/ConModAdmin"
import AdminProfPrincipal from "./components/AdminProfPrincipal"
import AdminAdminPrincipal from "./components/AdminAdminPrincipal"
import AddAsignarAct from "./components/AddAsignarAct"
import AddTarea from "./components/AddTarea"
import Feedback from "./components/Feedback"

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
                    <LoggedInRouteAdmin exact path="/ConModTeacher/:id" component={ConModTeacher} />
                    <LoggedInRouteAdmin exact path="/ConModAdmin/:id" component={ConModAdmin} />
                    <LoggedInRouteTeacher exact path="/ConModStudent/:id" component={ConModStudent} />
                    <LoggedInRouteTeacher exact path="/Feedback/:id" component={Feedback} />
                    <Route exact path="/AdminAlumPrincipal" component={AdminAlumPrincipal} />
                    <Route exact path="/AdminProfPrincipal" component={AdminProfPrincipal} />
                    <Route exact path="/AdminAdminPrincipal" component = {AdminAdminPrincipal} />
                    <LoggedInRouteAdmin exact path="/Register/:user" component={Register} />
                    <Route exact path="/ListaActividades" component={ListaActividades} />
                    <Route exact path="/AddActividad" component={AddActividad} />
                    <Route exact path="/ModActividad/:id" component={ModActividad} />
                    <Route exact path="/ListaTareas" component={ListaTareas} />
                    <Route exact path="/AddAsignarAct" component={AddAsignarAct} />
                    <Route exact path="/AddTarea" component={AddTarea} />
                    <Route path="*" component={() => <h3>URL invalida. Esta página web no existe</h3>} />
                </Switch>
            </BrowserRouter>
        )
    }
}
