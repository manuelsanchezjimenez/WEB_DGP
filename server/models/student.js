const mongoose = require(`mongoose`)

let studentSchema = new mongoose.Schema(
   {
        usuario: {type: String, required: true, unique: true},
        nombre: {type: String, required: true},
        tipo: {type: int, required: true},
        contra: {type: String, required: true},
        foto: {type: Image},
        profesor: {type: String, required: false},
        actividad: {type: String, required: false}
   },
   {
        collection: `student`
   })

module.exports = mongoose.model(`student`, studentSchema)