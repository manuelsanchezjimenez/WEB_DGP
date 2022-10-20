const mongoose = require(`mongoose`)

let requiereSchema = new mongoose.Schema(
   {
        id_tarea: {type: String, required: true, unique: true},
        nombre_material: {type: String, required: true},
        ejemplares: {type: int, required: false}
   },
   {
        collection: `requiere`
   })

module.exports = mongoose.model(`requiere`, requiereSchema)