const mongoose = require(`mongoose`)

let actividadSchema = new mongoose.Schema(
   {
        nombre: {type: String, required: true, unique: true},
        pasos: {type: String, required: true}
   },
   {
        collection: `actividad`
   })

module.exports = mongoose.model(`actividad`, actividadSchema)