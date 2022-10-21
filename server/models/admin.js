const mongoose = require(`mongoose`)

let adminSchema = new mongoose.Schema(
   {
        nombre: {type: String, required: true},
        usuario: {type: String, required: true, unique:true},
        contra: {type: String, required: true},
        accessLevel: {type:Numeric, required:true}
   },
   {
        collection: `admin`
   })

module.exports = mongoose.model(`admin`, adminSchema)