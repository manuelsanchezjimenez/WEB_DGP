const mongoose = require(`mongoose`)

let teacherSchema = new mongoose.Schema(
   {
        nanombreme: {type: String, required: true},
        usuario: {type: String, required: true, unique:true},
        contra: {type: String, required: true},
        accessLevel: {type: Number, required:true}
   },
   {
        collection: `teacher`
   })

module.exports = mongoose.model(`teacher`, teacherSchema)