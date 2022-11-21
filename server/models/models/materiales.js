const mongoose = require(`mongoose`)

let materialesSchema = new mongoose.Schema(
   {
        nombre: {type: String, required: true, unique: true},
        cantidad: {type: Number, required: false},
        imagen: {type: Image, required: false}
   },
   {
        collection: `materiales`
   })

module.exports = mongoose.model(`materiales`, materialesSchema)