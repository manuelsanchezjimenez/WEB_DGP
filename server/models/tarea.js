const mongoose = require(`mongoose`)

let tareaSchema = new mongoose.Schema(
   {
        id: {type: String, required: true, unique: true},
        nombre: {type: String, required: true},
        descripcion: {type: int, required: true},
        plazo: {type: Date, required: true},
        recordar: {type: Boolean, required: false},
        completado: {type: Boolean, required: false},
        alumno: {type: String, required: false}
   },
   {
        collection: `tarea`
   })

module.exports = mongoose.model(`tarea`, tareaSchema)