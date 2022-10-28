const mongoose = require(`mongoose`)

let adminSchema = new mongoose.Schema(
   {
        nombre: {type: String, required: true},
        usuario: {type: String, required: true, unique:true},
        contra: {type: String, required: true},
        correo: {type: String, required: true},
        telefono: {type: String, required: true},
        dni: {type: String, required: true},
        accessLevel: {type: Number, required:true}
   },
   {
        collection: `admin`
   })

module.exports = mongoose.model(`admin`, adminSchema)