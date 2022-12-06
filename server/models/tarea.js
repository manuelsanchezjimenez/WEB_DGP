const mongoose = require(`mongoose`)

let tareaSchema = new mongoose.Schema(
   {
        nombre: {type: String, required: true},
        descripcion: {type: String, required: true},
        fechaInicio: {type: Date, required: true},
        fechaFinal: {type: Date, required: true},
        completado: {type: Boolean, required: true},
        alumno: {type: String, required: true},
        alumnoID: {type: String, required: true},
        type: {type: Number, required: true},
        enlaceVideo: {type: String, required: false},
        enlaceAudio: {type: String, required: false},
        feedbackAlum: {type: String, required: false},
        feedbackProf: {type: String, required: false}
   },
   {
        collection: `tarea`
   })

module.exports = mongoose.model(`tarea`, tareaSchema)
