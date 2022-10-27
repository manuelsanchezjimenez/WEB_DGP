import axios from "axios"
import React, { Component } from "react"
import { Link } from 'react-router-dom'
import { useState } from 'react';
import Header from "./Header"
import { SERVER_HOST } from "../config/global_constants"
import "../css/AddTareaFija.css"

export default class AddTareaFija extends Component {
   constructor(props) {
      super(props);

      this.state = {
         // error: null,
         // mounted: false,
         // alumnos: [],
         value: ''
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
   }

   // componentDidMount() {
   //    var bodyFormData = new FormData();
   //    axios({
   //       method: "get",
   //       url: `${SERVER_HOST}/Users/alumnos`,
   //       data: bodyFormData,
   //       headers: { "Content-Type": "multipart/form-data" },
   //    }).then(res => {
   //       //handle success
   //       this.setState({ alumnos: res.data })
   //       this.setState({ mounted: true })
   //    }).catch(err => {
   //       //handle error

   //    });
   

   // MyForm() {
   //    const [inputs, setInputs] = useState({});

   //    const handleChange = (event) => {
   //      const name = event.target.name;
   //      const value = event.target.value;
   //    //   setInputs(values => ({...values, [name]: value}));
   //      setInputs(values => ({ [newTitulo]: newTitulo, [newDescripcion]: newDescripcion}));

   //    }

   //    const handleSubmit = (event) => {
   //      event.preventDefault();
   //      alert(inputs);
   //    }
   // }

   handleChange(event) {
      this.setState({ value: event.target.value });
   }

   handleSubmit(event) {
      alert('A name was submitted: ' + this.state.value);
      event.preventDefault();
   }

   render() {
      return (
         <div className="web-container">
            <Header />
            Aquí se añaden tareas
            <div className="formulario">
               <form onSubmit={this.handleSubmit}>

                  <div>
                     <label>
                        Name:
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                     </label>

                  </div>
                  <div>
                     Secuencia de pictogramas
                  </div>
                  <button className="boton b1" type="submit">
                     Añadir
                  </button>
               </form>
            </div>
         </div>
      );
   }
}