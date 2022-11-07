const mongoose = require(`mongoose`)

let studentImageSchema = new mongoose.Schema(
     {
          filename:{type:String}
     })

let studentSchema = new mongoose.Schema(
   {
        usuario: {type: String, required: true, unique: true},
        nombre: {type: String, required: true},
        tipo: {type: Number, required: true},
        contra: {type: String, required: true},
        correo: {type: String, required: true},
        fechaNacimiento: {type: Date, required: true},
        dni: {type: String, required: true},
        clase: {type: Number, required:true},
        foto: studentImageSchema,
        profesor: {type: String, required: false},
        actividad: {type: String, required: false}
   },
   {
        collection: `student`
   })

module.exports = mongoose.model(`student`, studentSchema)