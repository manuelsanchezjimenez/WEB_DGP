const mongoose = require(`mongoose`)

let actividadSchema = new mongoose.Schema(
   {
        nombre: {type: String, required: true, unique: true},
        descripcion: {type: String, required: true},
        enlaceVideo: {type: String, required: false},
        enlaceAudio: {type: String, required: false},
        type: {type: Number, required: true}
   },
   {
        collection: `actividad`
   })

module.exports = mongoose.model(`actividad`, actividadSchema)