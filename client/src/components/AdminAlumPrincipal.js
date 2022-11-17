import axios from "axios"
import React, { Component } from "react"
import { Link } from 'react-router-dom'
import Header from "./Header"
import { SERVER_HOST } from "../config/global_constants"
import "../css/AdminAlumPrincipal.css"

/*import PropTypes from 'prop-types';
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

function createData(Usuario, Nombre, Usuario, Curso,) {
   return {
      Usuario,
      Nombre,
      Usuario,
      Curso,
   };
}

const rows = [
   createData('12345678AZ', 'Alumno1','prueba prueba' ,4),
   createData('123456788B', 'Alumno2','prueba2 prueba2' ,4),
   
];

function descendingComparator(a, b, orderBy) {
   if (b[orderBy] < a[orderBy]) {
      return -1;
   }
   if (b[orderBy] > a[orderBy]) {
      return 1;
   }
   return 0;
}

function getComparator(order, orderBy) {
   return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
   const stabilizedThis = array.map((el, index) => [el, index]);
   stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
         return order;
      }
      return a[1] - b[1];
   });
   return stabilizedThis.map((el) => el[0]);
}

const headCells = [
   {
      id: 'Usuario',
      numeric: false,
      disablePadding: true,
      label: 'Usuario',
   },
   {
      id: 'Nombre',
      numeric: true,
      align: 'center',
      disablePadding: false,
      label: 'Nombre',
   },
   {
      id: 'Usuario',
      numeric: true,
      disablePadding: false,
      label: 'Usuario',
   },
   {
      id: 'Curso',
      numeric: true,
      disablePadding: false,
      label: 'Curso ',
   },

];

function EnhancedTableHead(props) {
   const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
   const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
   };

   return (
      <TableHead>
         <TableRow>
            
            {headCells.map((headCell) => (
               <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === headCell.id ? order : false}
               >
                  <TableSortLabel
                     active={orderBy === headCell.id}
                     direction={orderBy === headCell.id ? order : 'asc'}
                     onClick={createSortHandler(headCell.id)}
                  >
                     {headCell.label}
                     {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                           {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                     ) : null}
                  </TableSortLabel>
               </TableCell>
            ))}
         </TableRow>
      </TableHead>
   );
}

EnhancedTableHead.propTypes = {
   numSelected: PropTypes.number.isRequired,
   onRequestSort: PropTypes.func.isRequired,
   onSelectAllClick: PropTypes.func.isRequired,
   order: PropTypes.oneOf(['asc', 'desc']).isRequired,
   orderBy: PropTypes.string.isRequired,
   rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
   const { numSelected } = props;

   return (
      <Toolbar
         sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
               bgcolor: (theme) =>
                  alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
         }}
      >
         {numSelected > 0 ? (
            <Typography
               sx={{ flex: '1 1 100%' }}
               color="inherit"
               variant="subtitle1"
               component="div"
            >
               {numSelected} selected
            </Typography>
         ) : (
            <Typography
               sx={{ flex: '1 1 100%' }}
               variant="h6"
               id="tableTitle"
               component="div"
            >
               ALUMNADO
            </Typography>
         )}
      </Toolbar>
   );
}

EnhancedTableToolbar.propTypes = {
   numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
   const [order, setOrder] = React.useState('asc');
   const [orderBy, setOrderBy] = React.useState('Nombre');
   const [selected, setSelected] = React.useState([]);
   const [page, setPage] = React.useState(0);
   const [dense, setDense] = React.useState(false);
   const [rowsPerPage, setRowsPerPage] = React.useState(5);

   const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
   };

   const handleSelectAllClick = (event) => {
      if (event.target.checked) {
         const newSelected = rows.map((n) => n.Usuario);
         setSelected(newSelected);
         return;
      }
      setSelected([]);
   };

   const handleClick = (event, Usuario) => {
      const selectedIndex = selected.indexOf(Usuario);
      let newSelected = [];

      if (selectedIndex === -1) {
         newSelected = newSelected.concat(selected, Usuario);
      } else if (selectedIndex === 0) {
         newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
         newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
         newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
            
         );
      }

      setSelected(newSelected);
   };

   const handleChangePage = (event, newPage) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   const handleChangeDense = (event) => {
      setDense(event.target.checked);
   };

   const isSelected = (Usuario) => selected.indexOf(Usuario) !== -1;

   // Avoid a layout jump when reaching the last page with empty rows.
   const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

   return (
      <div>
         <Header></Header>
         <div className = "Pantalla">
         <div className="Tabla">
            <Box sx={{ width: '100%'}}>
               <Paper sx={{ width: '100%', mb: 2 }}>
                  <EnhancedTableToolbar numSelected={selected.length} />
                  <TableContainer>
                     <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                     >
                        <EnhancedTableHead
                           numSelected={selected.length}
                           order={order}
                           orderBy={orderBy}
                           onSelectAllClick={handleSelectAllClick}
                           onRequestSort={handleRequestSort}
                           rowCount={rows.length}
                        />
                        <TableBody>
                           {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) }
                           {stableSort(rows, getComparator(order, orderBy))
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((row, index) => {
                                 const isItemSelected = isSelected(row.Usuario);
                                 const labelId = `enhanced-table-checkbox-${index}`;

                                 return (
                                    <TableRow
                                       hover
                                       onClick={(event) => handleClick(event, row.Usuario)}
                                       role="checkbox"
                                       aria-checked={isItemSelected}
                                       tabIndex={-1}
                                       key={row.Usuario}
                                       selected={isItemSelected}
                                    >
                                       
                                       <TableCell
                                          component="th"
                                          id={labelId}
                                          scope="row"
                                       >
                                          {row.Usuario}
                                       </TableCell>
                                       <TableCell align="right">{row.Nombre}</TableCell>
                                       <TableCell align="right">{row.Usuario}</TableCell>
                                       <TableCell align="right">{row.Curso}</TableCell>
                                       <TableCell align="right"><Link to="/AdminAlumPrincipal"><input id="modificarAlumno" type="button" className="boton3" value="MODIFICAR ALUMNO"/></Link></TableCell>
                                       <TableCell align="right"><Link to="/AdminAlumPrincipal"><input id="eliminarAlumno" type="button" className="boton3" value="ELIMINAR ALUMNO"/></Link></TableCell>
                                    </TableRow>
                                 );
                              })}
                           {emptyRows > 0 && (
                              <TableRow
                                 style={{
                                    height: (dense ? 33 : 53) * emptyRows,
                                 }}
                              >
                                 <TableCell colSpan={6} />
                              </TableRow>
                           )}
                        </TableBody>
                     </Table>
                  </TableContainer>
                  <TablePagination
                     rowsPerPageOptions={[5, 10, 25]}
                     component="div"
                     count={rows.length}
                     rowsPerPage={rowsPerPage}
                     page={page}
                     onPageChange={handleChangePage}
                     onRowsPerPageChange={handleChangeRowsPerPage}
                  />
               </Paper>
               
            </Box>
         </div>
         
         <div className="Botones">
         <Link to="/Register"><input id="aniadirAlumno" type="button" className="boton2" value="AÑADIR ALUMNO"/></Link>
 
         </div>
         </div>
      </div>

   );
}
*/

const AlumnRow = ({ nombre, Usuario, curso }) => {
   return (
      <tr>
         <td>{`${nombre}`}</td>
         <td>{`${Usuario}`}</td>
         <td>{`${curso}`}</td>
      </tr>
   )
}

export default class ListaAlumnos extends Component {
   constructor(props) {
      super(props);
      this.state = {
         error: null,
         mounted: false,
         search: "",
         alumnos: [],
         muestraAlumnos: []
      };
      this.showTable = this.showTable.bind(this);
      this.sortResults = this.sortResults.bind(this);
   }
   componentDidMount() {
      axios.get(
         `${SERVER_HOST}/Users/student`,
         { headers: { "Content-type": "multipart/form-data" } })
         .then(res => {
            if (res.data) {
               if (res.data.errorMessage) {
                  alert("No se han podido tomar los datos " + res.data.errorMessage);
                  console.log(res.data.errorMessage)
                  this.setState({ error: res.data.errorMessage });
               } else {
                  let getData = JSON.parse(JSON.stringify(res.data).toString());
                  let saveData = [];
                  for (let i = 0; i < getData.length; i++) {
                     saveData.push({ nombre: getData[i].nombre, Usuario: getData[i].usuario, curso: getData[i].clase, key: getData[i]._id });
                  }
                  // this.setState({ actividades: tableData, muestraAlumnos: tableData, mounted: true });
                  this.setState({ alumnos: saveData, muestraAlumnos: saveData, mounted: true });
               }
            } else {
               this.setState({ error: "No se han encontrado alumnos" });
               console.log("No se han encontrado alumnos")
            }
         })
   }
   filterResults = (query, results) => {
      return results.filter(alumno => {
         const name = alumno.nombre.toLowerCase();

         return name.includes(query);
      });
   };
   sortResults = event => {
      this.setState(prevState => {
         const { muestraAlumnos, sortOrder } = prevState;
         if (sortOrder === "desc") {
            muestraAlumnos.sort((a, b) => {
               if (a.nombre > b.nombre) {
                  return -1;
               }
               return a.nombre > b.nombre ? 1 : 0;
            });
         } else {
            muestraAlumnos.sort((a, b) => {
               if (a.nombre < b.nombre) {
                  return -1;
               }
               return a.nombre < b.nombre ? 1 : 0;
            });
         }
         return {
            muestraAlumnos,
            sortOrder: sortOrder === "desc" ? "asc" : "desc"
         };
      });
   };
   onChange = e => {
      const query = e.target.value;
      this.setState(prevState => ({
         muestraAlumnos:
            query.length > 0
               ? this.filterResults(query, prevState.alumnos)
               : prevState.alumnos
      }));
   };
   showTable() {
      const pictos = [];

      // for (let i = 0; i < this.state.muestraActividades; i++) {
      let i = 0;
      pictos.push(
         <div key={i++}>
            <input label="Search" onChange={this.onChange} placeholder="Buscar Alumno..." />
            <div>
               <table className="table table-bordered" >
                  <tbody>
                     <tr>
                        <th
                           style={{ cursor: "pointer" }}
                           onClick={this.sortResults}
                           // onClick={() => { this.sortResults() }}
                           id="name"
                        >
                           Nombre
                        </th>
                        <th>
                           Usuario
                        </th>
                        <th>
                           Curso
                        </th>
                        <th>
                           Moficacion
                        </th>
                     </tr>
                     {this.state.muestraAlumnos.map(item => (
                        <AlumnRow
                           nombre={item.nombre}
                           Usuario={item.Usuario}
                           curso={item.curso}
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
            <div className="Pantalla">
               <div className="Tabla">


                  {this.state.error ? <div>Error: {this.state.error.message}</div> : null}
                  {this.state.mounted ? null : <div> Cargando alumnos... </div>}
                  {this.showTable()}
<<<<<<< Updated upstream
               </div>
               <div>
               </div>
=======
               </div>
               <div>
               </div>
>>>>>>> Stashed changes
               <div className="Body">
                  <div className="botonesContainer">
                     {/* <Link to="/AdminAlumPrincipal"><input id="modificarAlumno" type="button" className="boton3" value="MODIFICAR ALUMNO" /></Link>
                  <Link to="/AdminAlumPrincipal"><input id="eliminarAlumno" type="button" className="boton3" value="ELIMINAR ALUMNO" /></Link> */}

                     <Link to="/Register"><input id="aniadirAlumno" type="button" className="boton2" value="AÑADIR ALUMNO" /></Link>

                  </div>
               </div></div>
         </div>

      )
   }



}
