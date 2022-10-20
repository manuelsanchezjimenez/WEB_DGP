const mongoose = require(`mongoose`)

let teacherSchema = new mongoose.Schema(
   {
        name: {type: String, required: true},
        user: {type: String, required: true, unique:true},
        password: {type: String, required: true},
   },
   {
        collection: `teacher`
   })

module.exports = mongoose.model(`teacher`, teacherSchema)