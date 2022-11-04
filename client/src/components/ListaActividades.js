import axios from "axios"
import React, { Component } from "react"
import { Link } from 'react-router-dom'
import Header from "./Header"
import { SERVER_HOST } from "../config/global_constants"
import "../css/AdminAlumPrincipal.css"
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

function createData(Nombre, key) {
   return {
      Nombre, key
   };
}

const tableData = [
   createData('Actividad1' , '1' ),
   createData('Actividad2' , '2' ),
   createData('Actividad3' , '3' ),
   createData('Actividad4' , '4' ),
   createData('Actividad5' , '5' ),
   createData('Actividad6' , '6' ),
   createData('Actividad7' , '7' ),
   createData('Actividad8' , '8' ),
   createData('Actividad9' , '9' ),
   createData('Actividad10', '10' ),
   createData('Actividad11', '11' ),
   createData('Actividad12', '12' ),
];

const EmployeeRow = ({ Nombre }) => {
   return (
      <tr>
         <th>{`${Nombre}`}</th>
      </tr>
   );
};


export default class ListaActividades extends Component {
   constructor(props) {
      super(props);
      this.state = {
         error: null,
         mounted: false,
         actividades: [],
         search: "",
         sort: "asc",

         originalResults: [],
         displayResults: []
      };
      this.listaImages = this.listaImages.bind(this);
      this.sortResults = this.sortResults.bind(this);

   }

   componentDidMount() {
      // var bodyFormData = new FormData();
      // axios({
      //    method: "get",
      //    url: `${SERVER_HOST}/actividades/get`,
      //    data: null, // bodyFormData,
      //    headers: { "Content-Type": "multipart/form-data" },
      // }).then(res => {
      //    //handle success
      //    this.setState({ actividades: res.data, mounted: true })
      // }).catch(err => {
      //    //handle error
      //    alert('Ups error');
      //    let algo = ['tarea1', 'tarea2', 'tarea3', 'tarea4', 'tarea5', 'tarea6', 'tarea7', 'tarea8',];

      // });
      this.setState({ originalResults: tableData, mounted: true });
      this.setState({ originalResults: tableData, displayResults: tableData });
   }

   filterResults = (query, results) => {
      return results.filter(actividad => {
         const name = actividad.Nombre.toLowerCase();

         return name.includes(query);
      });
   };


   // sortResults = event => {
   sortResults (event) {
      this.setState(prevState => {
        const { displayResults, sortOrder } = prevState;
  
        if (sortOrder === "desc") {
          displayResults.sort((a, b) => {
            if (a.firstName > b.firstName) {
              return -1;
            }
            return a.firstName > b.firstName ? 1 : 0;
          });
        } else {
          displayResults.sort((a, b) => {
            if (a.firstName < b.firstName) {
              return -1;
            }
            return a.firstName > b.firstName ? 1 : 0;
          });
        }
  
        return {
          displayResults,
          sortOrder: sortOrder === "desc" ? "asc" : "desc"
        };
      });
    };
  
   onChange = e => {
      const query = e.target.value;
  
      this.setState(prevState => ({
        displayResults:
          query.length > 0
            ? this.filterResults(query, prevState.originalResults)
            : prevState.originalResults
      }));
    };

   listaImages() {
      const pictos = [];
      // for (let i = 0; i < this.state.displayResults; i++) {
         let i=0;
      pictos.push(
         <div key={i++}>
            <input label="Search" onChange={this.onChange} placeholder="Buscar Actividad..."/>
            <div className="row">
               <table className="table table-bordered" style={{ width: "100%" }}>
                  <tbody>
                     <tr>
                        <th
                           style={{ cursor: "pointer" }}
                           onClick={this.sortResults}
                           // onClick={() => { this.sortResults() }}
                           id="name"
                        >
                           Name
                        </th>
                     </tr>
                     {this.state.displayResults.map(item => (
                        <EmployeeRow
                           Nombre={item.Nombre}
                           key={item.key}
                        />
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      );
      return pictos;
   }

   render() {
      return (
         <div className="web-container">
            <Header />
            <h1>Listado de actividades</h1>
            {this.state.error ? <div>Error: {this.state.error.message}</div> : null}
            {this.state.mounted ? null : <div> Cargando pool de tareas fijas... </div>}
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
            </table> */}
            ºººººººººººººººººººº
            {this.listaImages()}
            ºººººººººººººººººººº
            <div>
               {/* <input label="Search" onChange={this.onChange} />
               <div className="row">
                  <table style={{ width: "100%" }}>
                     <tbody>
                        <tr>
                           <th style={{ cursor: "pointer" }} onClick={this.sortResults} id="Nombre">Nombre</th>
                        </tr>
                        {[...actividadResults].map((item) =>
                           <actividadRow
                              Nombre={item.Nombre}
                           // key={item.key}
                           />
                        )}
                     </tbody>
                  </table>
               </div> */}
            </div>
            <div className="Body">
               <div className="botonesContainer">
                  <Link to="/AddActividad"><input id="addActividad" type="button" value="AÑADIR ACTIVIDAD" /></Link>
                  {/* <input id="modificar" type="button" className="" value="MODIFICAR TAREA" /> */}
                  <Link to="/ListaTareas"><input id="toggleATareas" type="button" value="VER TAREAS ASIGNADAS" /></Link>
               </div>
            </div>
         </div>
      )
   }
}
