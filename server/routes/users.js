const router = require(`express`).Router()
const studentModel = require(`../models/student`)
const teacherModel = require(`../models/teacher`)
const adminModel = require(`../models/admin`)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
var urlencode = require('urlencode');

//this is for multipart form data
const multer  = require('multer')
const student = require('../models/student')
//const upload = multer()
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
var upload = multer({ storage: storage });

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
                }
            })
        })
    }) 
    
    return next(createError(400, "El usuario no existe."))
}

const checkUserNotExists = (req, res, next) =>  
{
    req.body.password = urlencode.decode(req.body.password)
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
    bcrypt.hash(req.body.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>  
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
            profesor: req.body.profesor, 
            actividad: req.body.actividad,
            foto: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), //Necesario que le llegue el nombre del archivo en esa variable
                contentType: 'image/png'
            }
        }
        studentModel.create(student, (err, data) => 
        {
            if(err)
            {
                return next(err)
            }
            req.data = data
            return next()
        })
    })
}

const createTeacher = (req, res, next) => 
{
    bcrypt.hash(req.body.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>  
    {
        if(err)
        {
            return next(err)
        }
        teacherModel.create({usuario:req.body.usuario,nombre:req.body.nombre,contra:hash, accesLevel: process.env.ACCESS_LEVEL_TEACHER}, (err, data) => 
        {
            if(err)
            {
                return next(err)
            }
            req.data = data
            return next()
        })
    })
}

const createAdmin = (req, res, next) => {  
    bcrypt.hash(process.env.ADMIN_PASSWORD.toString(), parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>  
    {
        if(err){
            return next(err)
        }
        adminModel.create({usuario:req.body.usuario,nombre:req.body.nombre,contra:hash, accesLevel: process.env.ACCESS_LEVEL_ADMIN}, (error, createData) => 
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
    adminModel.findOne({usuario: req.decodedToken.usuario}, (error, data) =>{
        if(error){
            console.log(error)
        }else{
            if(data){
                req.user = data
                return next()
            }else
                return next(createError(400, "Admin not found."))
        } 
    })
}

const findTeacher = (req, res, next) =>
{
    teacherModel.findOne({usuario: req.decodedToken.usuario}, (error, data) =>{
        if(error){
            console.log(error)
        }else{
            if(data){
                req.user = data
                return next()
            }else
                return next(createError(400, "Teacher not found."))
        } 
    })
}

const findStudent = (req, res, next) =>
{
    studentModel.findOne({usuario: req.decodedToken.usuario}, (error, data) =>{
        if(error){
            console.log(error)
        }else{
            if(data){
                req.user = data
                return next()
            }else
                return next(createError(400, "Student not found."))
        } 
    })
}

/*
const updateProfile = (req,res,next) =>
{
    if(req.body.userType == "tenant"){
        tenantModel.findOneAndUpdate({userID: req.user._id}, {name: req.data.name, id:req.body.id, phoneNumber:req.body.phoneNumber}, (err, data) => 
        {
            if(err)
                return next(createError(400, err))
        })
    }else{
        residentModel.findOneAndUpdate({name:req.body.name, id:req.body.id, phoneNumber:req.body.phoneNumber}, (err, data) => 
        {
            if(err)
                return next(createError(400, err))
        })
    }
    usersModel.findOneAndUpdate({}, {name: req.body.username, password: req.body.password},(err, data) =>{
        if(err){
            return next(createError(400, err))
        }
        if(data){
            return next()
        }
    })
}*/

//Register
router.post(`/Users/register/student`, upload.single('image'), checkUserNotExists, createStudent) 
router.post(`/Users/register/teacher`, upload.none(), checkUserNotExists, createTeacher) 
router.post(`/Users/register/admin`, upload.none(), checkUserNotExists, createAdmin) 
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
//Update profile
//router.put(`/Users/profile`, checkUserLogged, findUser, updateProfile)