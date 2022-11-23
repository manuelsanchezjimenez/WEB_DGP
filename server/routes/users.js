const router = require(`express`).Router()
const studentModel = require(`../models/student`)
const teacherModel = require(`../models/teacher`)
const adminModel = require(`../models/admin`)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
var urlencode = require('urlencode')

const fs = require('fs')
const path = require("path")

//this is for multipart form data
const multer  = require('multer')
var upload = multer({dest: `${process.env.UPLOADED_FILES_FOLDER}`})
  

//Middleware
const checkUserExists = (req, res, next) =>
{
    req.body.contra = urlencode.decode(req.body.contra)

    
    studentModel.findOne({usuario:req.body.usuario}, (err, data) => 
    {
        if(data){
            if(err)
                return next(err)
            req.data = data            
            return next()
        }
        teacherModel.findOne({usuario:req.body.usuario}, (err, data) =>  {
            if(data){
                if(err)
                    return next(err)
                req.data = data            
                return next()
            }
            adminModel.findOne({usuario:req.body.usuario}, (err, data) => {
                if(data){
                    if(err)
                        return next(err)
                    req.data = data            
                    return next()
                }else
                    return next(createError(400, "El usuario no existe."))
            })
        })
    })  
}

const checkUserNotExists = (req, res, next) =>  
{
    studentModel.findOne({usuario:req.body.usuario}, (err, data) => 
    {
        if(data){
            if(err){
                return next(err)
            }
            return next(createError(400, "El usuario ya existe como estudiante."))
        }

        teacherModel.findOne({usuario:req.body.usuario}, (err, data) =>  {
            if(data){
                if(err){
                    return next(err)
                }
                console.log(data)
                return next(createError(400, "El usuario ya existe como profesor."))
            }
            adminModel.findOne({usuario:req.body.usuario}, (err, data) => {
                if(data){
                    if(err){
                        return next(err)
                    }
                    return next(createError(400, "El usuario ya existe como admin."))
                }
            })
        })
    }) 
    
    return next()
}

const checkLogIn = (req, res, next) => 
{    
    bcrypt.compare(req.body.contra, req.data.contra, (err, result) =>
    {  
        console.log(req.body.contra, req.body.contra)   
        if(err){
            return next(err)
        }
        if(!result)
        {  
            return next(createError(400, "Error. Email or password are incorrect. Please try again."))

        }        
        
        return next()        
    })
}

const logInUser = (req, res, next) => 
{
    const token = jwt.sign({usuario:req.data.usuario, accessLevel:req.data.accessLevel}, process.env.JWT_PRIVATE_KEY, {algorithm:'HS256', expiresIn:process.env.JWT_EXPIRY})     
           
    res.json({usuario:req.data.usuario, accessLevel:req.data.accessLevel, token:token})
}


const createStudent = (req, res, next) => 
{
    bcrypt.hash(req.body.contra, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>  
    {
        if(err)
        {
            return next(err)
        }

        var student = {
            usuario:req.body.usuario,
            nombre:req.body.nombre,
            contra:hash, 
            tipo: req.body.tipo, 
            profesor: null, 
            actividad: null,
            clase: req.body.clase,
            tipoLetra: req.body.tipoLetra,
            foto: {filename:`${req.file.filename}`}
        }

        
        studentModel.create(student, (err, data) => 
        {
            if(err)
            {
                return next(err)
            }
            res.json({data: data})
        })
    })
}

const createTeacher = (req, res, next) => 
{
    bcrypt.hash(req.body.contra, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>  
    {
        if(err)
        {
            return next(err)
        }
        teacherModel.create({usuario:req.body.usuario,nombre:req.body.nombre,contra:hash, accessLevel: process.env.ACCESS_LEVEL_TEACHER}, (err, data) => 
        {
            if(err)
            {
                return next(err)
            }
            res.json(data)
        })
    })
}

const createAdmin = (req, res, next) => {  
    bcrypt.hash(req.body.contra, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>  
    {
        if(err){
            return next(err)
        }
        adminModel.create({usuario:req.body.usuario,nombre:req.body.nombre,contra:hash, accessLevel: process.env.ACCESS_LEVEL_ADMIN}, (error, createData) => 
        {
            if(error){
                return next(error)
            }
            if(createData)
            {
                res.json(createData)
            }else{
                return next(createError(500, "Error creating admin."))
            }
        })
    })
}
/*
const createAdminBase = (req, res, next) => {
    bcrypt.hash(process.env.ADMIN_PASSWORD.toString(), parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>  
    {
        if(err){
            return next(err)
        }
        adminModel.create({nombre:"Administrador", usuario:"admin123", contra:hash, accesLevel: process.env.ACCESS_LEVEL_ADMIN}, (error, createData) => 
        {
            if(error){
                return next(error)
            }
            if(createData)
            {
                res.json(createData)
            }else{
                return next(createError(500, "Error recreating the database."))
            }
        })
    })
}*/

const checkUserLogged = (req, res, next) =>
{
    jwt.verify(req.headers.authorization, process.env.JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) => 
    {
        if (err) 
        { 
            return next(createError(400, "User is not logged in."))
        }
        else 
        {
            req.decodedToken = decodedToken
            return next()
        }
    })
}

const findAdmin = (req, res, next) =>
{
    adminModel.findOne({_id: req.params.id}, (error, data) =>{
        if(error){
            console.log(error)
        }else{
            if(data){
                res.json({usuario: data})
            }else
                return next(createError(400, "Admin not found."))
        } 
    })
}

const findTeacher = (req, res, next) =>
{
    teacherModel.findOne({_id: req.params.id}, (error, data) =>{
        if(error){
            console.log(error)
        }else{
            if(data){
                res.json({usuario: data})
            }else
                return next(createError(400, "Teacher not found."))
        } 
    })
}

const findStudent = (req, res, next) =>
{
    studentModel.findOne({_id: req.params.id}, (error, data) =>{
        if(error){
            console.log(error)
        }else{
            if(data){
                res.json({usuario: data})
            }else
                return next(createError(400, "Student not found."))
        } 
    })
}

router.get(`/Users/image/:filename`, (req, res) => 
{   
    let image
    fs.readFile(`${process.env.UPLOADED_FILES_FOLDER}/${req.params.filename}`, 'base64', (err, fileData) => 
    {        
        if(fileData)
        {  
            image = fileData                          
        }
        res.json({image: image}) 
    })         
})


const findAllStudents = (req, res, next) => 
{
    studentModel.find({}, (error, data) =>{
        if(error){
            console.log(error)
        }else{
            if(data){
                res.json(data);
                return res;
            }else
                return next(createError(400, "Student not found."))
        } 
    })

}

const updateStudentProfile = (req,res,next) =>{

    var usuario
    if(req.body.contra == ''){
        studentModel.findOneAndUpdate({_id: req.body.id}, {usuario: req.body.usuario, nombre:req.body.nombre, tipo: req.body.tipo, profesor: req.body.profesor, tipoLetra: req.body.tipoLetra, clase: req.body.clase},{ returnDocument: 'after' }, (err, data) => 
            {
                if(err){
                    return next(createError(400, err))
                }
                if(data)
                    usuario = data
            })
        res.json({usuario: usuario})
    }else{
        bcrypt.hash(req.body.contra, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>  {
            if(err)
            {
                return next(err)
            }
            studentModel.findOneAndUpdate({_id: req.body.id}, {usuario: req.body.usuario, nombre:req.body.nombre, contra: hash, tipo: req.body.tipo, profesor: req.body.profesor, tipoLetra: req.body.tipoLetra, clase: req.body.clase},{ returnDocument: 'after' }, (err, data) => 
                {
                    if(err){
                        return next(createError(400, err))
                    }
                    if(data)
                        usuario = data
                })
            res.json({usuario: usuario})
        })
    }
}

const updateAdminProfile = (req,res,next) =>{

    var usuario
    if(req.body.contra == ''){
        adminModel.findOneAndUpdate({_id: req.body.id}, {usuario: req.body.usuario, nombre:req.body.nombre},{ returnDocument: 'after' }, (err, data) => 
            {
                if(err)
                    return next(createError(400, err))
                if(data)
                    usuario = data
            })
        res.json({usuario: usuario})
    }else{
        bcrypt.hash(req.body.contra, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>  {
            if(err)
            {
                return next(err)
            }
            adminModel.findOneAndUpdate({_id: req.body.id}, {usuario: req.body.usuario, nombre:req.body.nombre, contra: hash},{ returnDocument: 'after' }, (err, data) => 
                {
                    if(err){
                        return next(createError(400, err))
                    }
                    if(data)
                        usuario = data
                })
            res.json({usuario: usuario})
        })
    }
}

const updateTeacherProfile = (req,res,next) =>{

    var usuario
    if(req.body.contra == ''){
        teacherModel.findOneAndUpdate({_id: req.body.id}, {usuario: req.body.usuario, nombre:req.body.nombre}, {returnDocument: 'after'}, (err, data) => 
            {
                if(err)
                    return next(createError(400, err))
                if(data)
                    usuario = data 
            })
        res.json({usuario: usuario})
    }else{
        bcrypt.hash(req.body.contra, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>  {
            if(err)
            {
                return next(err)
            }
            teacherModel.findOneAndUpdate({_id: req.body.id}, {usuario: req.body.usuario, nombre:req.body.nombre, contra: hash},{ returnDocument: 'after' }, (err, data) => 
                {
                    if(err){
                        return next(createError(400, err))
                    }
                    if(data)
                        usuario = data
                })
            res.json({usuario: usuario})
        })
    }
}

const deleteTeacher = (req,res,next) =>{
    teacherModel.findByIdAndRemove({_id: req.params.id}, (err, data) => 
    {
        if(err)
            return next(createError(400, err))
        if(data)
            res.json({data: data})
    })
}

const deleteAdmin = (req,res,next) =>{
    adminModel.findByIdAndRemove({_id: req.params.id}, (err, data) => 
    {
        if(err)
            return next(createError(400, err))
        if(data)
            res.json({data: data})
    })
}

const deleteImages = (req, res, next) => {
    let pathArray = __dirname.split('\\')
    let path = pathArray.splice(-0, pathArray.length - 1).join('\\')

    req.property.images = req.property.images.map((image, index) => {
        fs.unlink(`${path}\\uploads\\${image.filename}`, (err) => { //Only deletes one image for now
            if(err)
                return next(createError(400, `Error on image deleting.`))
            else{
                if(index === req.property.images.length - 1){
                    return next()
                }
            }
        })
    })
}

const deleteStudent = (req,res,next) =>{
    var rutaFotos = __dirname.split('/')
        if(rutaFotos.length == 1){
            rutaFotos = __dirname.split('\\')
            rutaFotos.pop()
            rutaFotos = rutaFotos.join('\\')
        }else{
            rutaFotos.pop()
            rutaFotos = rutaFotos.join('/')
        }
    studentModel.findByIdAndRemove({_id: req.params.id}, (err, data) => 
    {
        if(err)
            return next(createError(400, err))
        if(data)
            res.json({data: data})
    })
}

//Register
router.post(`/Users/register/student`, upload.single('foto'), checkUserNotExists, createStudent) 
router.post(`/Users/register/teacher`, upload.none(), checkUserNotExists, createTeacher) 
router.post(`/Users/register/admin`, upload.none(), checkUserNotExists, createAdmin) 

//Delete
router.delete(`/Users/delete/teacher/:id`, checkUserLogged, deleteTeacher)
router.delete(`/Users/delete/admin/:id`, checkUserLogged, deleteAdmin)
router.delete(`/Users/delete/student/:id`, checkUserLogged, deleteStudent)

//LogIn
router.post(`/Users/login`, upload.none(), checkUserExists, checkLogIn, logInUser)
//check Log in
router.get('/Users/checkLogIn', checkUserLogged, (req, res) => {
    res.json({email:req.decodedToken.email, accessLevel:req.decodedToken.accessLevel, token: req.headers.authorization})
})
//Log out
router.post(`/Users/logout`, (req,res) => {       
    res.json({})
})
//Update profile        //Falta comprobar que no se cambie el usuario a uno ya existente en todos
router.put(`/Users/profile/admin`, checkUserLogged, updateAdminProfile) 
router.put(`/Users/profile/student`, checkUserLogged, updateStudentProfile) //Por ahora no se puede actualizar la imagen
router.put(`/Users/profile/teacher`, checkUserLogged, updateTeacherProfile) 

//Getters
router.get(`/Users/teacher/:id`, findTeacher)
router.get(`/Users/student`, findAllStudents)
router.get(`/Users/student/:id`, findStudent)
router.get(`/Users/admin/:id`, findAdmin)

module.exports = router 