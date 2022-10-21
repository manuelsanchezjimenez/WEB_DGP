const mongoose = require(`mongoose`)

let menuSchema = new mongoose.Schema(
   {
        fecha: {type: Date, required: true, unique: true},
        imagen_menu: {data: Buffer, contentType: String}
   },
   {
        collection: `menu`
   })

module.exports = mongoose.model(`menu`, menuSchema)