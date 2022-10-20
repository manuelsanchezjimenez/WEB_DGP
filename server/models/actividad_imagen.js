const mongoose = require(`mongoose`)

let actividad_imagenSchema = new mongoose.Schema(
   {
        nombre: {type: String, required: true, unique: true},
        imagen: {type: Image, required: true}
   },
   {
        collection: `actividad_imagen`
   })

module.exports = mongoose.model(`actividad_imagen`, actividad_imagenSchema)