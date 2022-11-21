const mongoose = require(`mongoose`)

let comandaSchema = new mongoose.Schema(
   {
        actividad: {type: String, required: true},
        cantidad: {type: Number, required: true}
   },
   {
        collection: `comanda`
   })

module.exports = mongoose.model(`comanda`, comandaSchema)