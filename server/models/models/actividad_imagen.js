const mongoose = require(`mongoose`)

let actividad_imagenSchema = new mongoose.Schema(
   {
     nombreAct: {type: String, required: true, unique: true},
     imagen: {type: String, required: true}
   },
   {
        collection: `actividad_imagen`
   })

module.exports = mongoose.model(`actividad_imagen`, actividad_imagenSchema)
