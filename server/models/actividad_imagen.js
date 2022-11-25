const mongoose = require(`mongoose`)

let actividad_imagenSchema = new mongoose.Schema(
  {
    actividad: { type: String, required: true, unique: true },
    orden: { type: Number, required: true, unique: true },
    imagen: { type: String, required: true }
  },
  {
    collection: `actividad_imagen`
  })

actividad_imagenSchema.index({ actividad: 1, orden: 1 }, { unique: true })
module.exports = mongoose.model(`actividad_imagen`, actividad_imagenSchema)
