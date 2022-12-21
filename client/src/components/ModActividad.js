import React, { Component } from "react"
import Header from "./Header"

import { Redirect, Link } from 'react-router-dom'

import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"
import "../css/ModActividad.css"

//<Link className="blue-button" to={{pathname: `ConModTeacher/${this.state.id}`}}> Modify </Link>


export default class ModActividad extends Component {
    constructor(props) {
        super(props)

        this.state = {
            idAct: '',
            nameAct: '',
            DescrAct: '',
            enlaceVideo: '',
            enlaceAudio: '',
            type: '',
            redirect: false,
            mounted: false
        }
    }
    componentDidMount = () => {
        console.log("Muestra: " + this.props.match.params.id);
        //axios.get(`${SERVER_HOST}/Users/teacher/635fb436e007e28b40b1c677`,{headers:{"authorization":localStorage.token}})
        axios.get(`${SERVER_HOST}/actividades/findByID/${this.props.match.params.id}`, { headers: { "authorization": localStorage.token } })
            .then(res => {
                if (res.data)
                    if (res.data.errorMessage)
                        console.log(res.data.errorMessage)
                    else {
                        this.setState({ nameAct: res.data.nombre })
                        this.setState({ idAct: res.data.id_t })
                        this.setState({ DescrAct: res.data.descripcion })
                        this.setState({ enlaceAudio: res.data.enlaceVideo })
                        this.setState({ enlaceVideo: res.data.enlaceAudio })
                        this.setState({ type: res.data.type })
                        this.setState({ mounted: true })

                    }

            }).catch(error => {
                console.log("err:" + error.response.data)
            })
    }

    handleChange = e => {

        this.setState({ [e.target.name]: e.target.value })

    }

    render() {
        return (
            <div id="registerWeb" className="Body">
                {this.state.redirect ? <Redirect to="/ListaActividades" /> : null}
                <Header />
                <div className="botonesContainer">
                    {this.state.redirect ? <Redirect to="/ListaActividades" /> : null}
                    <h1>Consulta de actividad </h1>

                    {this.state.mounted ?
                        <div className="botonesContainer2">
                            <div className="item-containerActividadGeneral">
                                <div className="item-containerActividad">
                                    Nombre de la actividad: {this.state.nameAct}
                                </div>
                                <br />
                                <div className="item-containerActividad">
                                    Enlace de video (opcional): {this.state.enlaceVideo}
                                </div>

                                <br />
                                <div className="item-containerActividad">
                                    Enlace de audio (opcional): {this.state.enlaceAudio}
                                </div>

                                <br />
                                <div className="item-containerActividad">
                                    Descripción :{this.state.DescrAct}
                                </div>

                                <br />
                                <div className="item-containerActividad">
                                    Tipo de tarea: {this.state.type === 1 ? "Actividad" : "Comanda"}
                                </div>


                                <br />

                            </div>


                        </div> : null}
                    <div id="buttons">
                        {/*<input type="button" className="green-button" value="Poner feedback" disabled={this.allFilled()} onClick={this.updateTarea} />*/}
                        <Link to="/ListaActividades"><input type="button" className="red-button" value="Volver a la Lista de Actividades" /></Link>
                    </div>
                </div>
            </div >
        )
    }
}