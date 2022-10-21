const mongoose = require(`mongoose`)

let menu_imagenSchema = new mongoose.Schema(
   {
        fecha: {type: Date, required: true, unique: true},
        imagen: {data: Buffer, contentType: String}
   },
   {
        collection: `menu_imagen`
   })

module.exports = mongoose.model(`menu_imagen`, menu_imagenSchema)