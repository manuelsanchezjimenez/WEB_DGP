import axios from "axios"
import React, { Component } from "react"
import { Link } from 'react-router-dom'
import Header from "./Header"
import { SERVER_HOST } from "../config/global_constants"
import "../css/ListaTareas.css"
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';

export default class ListaTareas extends Component {
   constructor(props) {
      super(props);
      this.state = {
         error: null,
         mounted: false,
         actividades: []
      };
   }

   componentDidMount() {
      var bodyFormData = new FormData();
      axios({
         method: "get",
         url: `${SERVER_HOST}/actividades/get`,
         data: null, // bodyFormData,
         headers: { "Content-Type": "multipart/form-data" },
      }).then(res => {
         //handle success
         this.setState({ actividades: res.data })
         this.setState({ mounted: true })
      }).catch(err => {
         //handle error
         //alert('Ups error');

      });
   }

   render() {
      return (
         <div className="web-container">
            <Header />
            <h1>Lista de tareas</h1>
            No implementado en esta iteración
            {/* {this.state.error ? <div>Error: {this.state.error.message}</div> : null}
            {this.state.mounted ? null :  <div> Cargando pool de tareas fijas... </div>} */}
            {/* <table className="table table-bordered">
               <thead>
                  <tr>
                     <th className="text-center">Título</th>
                  </tr>
               </thead>
               <tbody>
                  <tr><td>
                     una fila
                  </td>
                  </tr>
                  <tr><td>
                     dos filas
                  </td>
                  </tr>
                  <tr><td>
                     tres filas
                  </td>
                  </tr>
                  <tr><td>
                     cuatro filas
                     </td>
                  </tr>
               </tbody>
            </table>
            <div className="Body">
                <div className="botonesContainer">
                <input id="add" type="button" className="" value="AÑADIR TAREA FIJA"/>
                <input id="modificar" type="button" className="" value="MODIFICAR TAREA" />
                <input id="toggle" type="button" className="" value="VER TAREAS ASIGNADAS" />
                </div>
            </div> */}
            <Link to="/ListaActividades"><input id="toggleActividades" type="button" value="VER POOL DE ACTIVIDADES" /></Link>

         </div>
      )
   }
}
