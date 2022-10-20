const mongoose = require(`mongoose`)

let tareaSchema = new mongoose.Schema(
   {
        id: {type: String, required: true, unique: true},
        nombre: {type: String, required: true},
        plazo: {type: Date, required: true},
   },
   {
        collection: `tarea`
   })

module.exports = mongoose.model(`tarea`, tareaSchema)