const mongoose = require(`mongoose`)

let menuSchema = new mongoose.Schema(
   {
        fecha: {type: Date, required: true, unique: true},
        imagen_menu: {type: Image, required: false}
   },
   {
        collection: `menu`
   })

module.exports = mongoose.model(`menu`, menuSchema)