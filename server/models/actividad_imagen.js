const mongoose = require(`mongoose`)

let actividad_imagenSchema = new mongoose.Schema(
   {
        nombre: {type: String, required: true},
        imagen: {data: Buffer, contentType: String}
   },
   {
        collection: `actividad_imagen`
   })

module.exports = mongoose.model(`actividad_imagen`, actividad_imagenSchema)
