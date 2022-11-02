const mongoose = require(`mongoose`)

let tareaSchema = new mongoose.Schema(
   {
        nombre: {type: String, required: true},
        descripcion: {type: Number, required: true},
        fechaInicio: {type: Date, required: true},
        fechaFinal: {type: Date, required: false},
        completado: {type: Boolean, required: false},
        alumno: {type: String, required: false},
        actividad: {type: String, required: false}
   },
   {
        collection: `tarea`
   })

module.exports = mongoose.model(`tarea`, tareaSchema)