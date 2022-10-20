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
const upload = multer()

//Middleware
const checkUserExists = (req, res, next) =>
{
    req.body.password = urlencode.decode(req.body.password)
    usersModel.findOne({email:req.body.email}, (error, data) => 
    {
        if(error || !data){
            return next(createError(400), `User doesn't exists.`)
        }
        req.data = data            
        return next()        
    })    
}

const checkUserNotExists = (req, res, next) =>  //Done
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
    bcrypt.compare(req.body.password, req.data.password, (err, result) =>
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
    const token = jwt.sign({email:req.data.email, accessLevel:req.data.accessLevel}, process.env.JWT_PRIVATE_KEY, {algorithm:'HS256', expiresIn:process.env.JWT_EXPIRY})     
           
    res.json({email:req.data.email, accessLevel:req.data.accessLevel, token:token})
}


const createStudent = (req, res, next) => 
{
    bcrypt.hash(req.body.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>  
    {
        if(err)
        {
            return next(err)
        }
        studentModel.create({usuario:req.body.usuario,nombre:req.body.nombre,contra:hash, tipo: req.body.tipo, foto: req.body.foto, profesor: req.body.profesor, actividad: req.body.actividad}, (err, data) => 
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

const eliminateCollection = (req, res, next) =>
{
    usersModel.deleteMany({}, (error, data) =>{
        if(error){
            return next(error)
        }
        if(data){
            return next()
        }
    })
}

const createAdmin = (req, res, next) => {
    bcrypt.hash(process.env.ADMIN_PASSWORD.toString(), parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>  
    {
        if(err){
            return next(err)
        }
        usersModel.create({name:"Administrator", email:"admin@admin.com", password:hash, accessLevel:parseInt(process.env.ACCESS_LEVEL_ADMIN)}, (error, createData) => 
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
}

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
const findUser = (req, res, next) =>
{
    usersModel.findOne({email: req.decodedToken.email}, (error, data) =>{
        if(error){
            console.log(error)
        }else{
            if(data){
                req.user = data
                return next()
            }else
                return next(createError(400, "User not found."))
        } 
    })
}

const findResident = (req, res, next) => {
    residentModel.findOne({userID: req.user._id}, (err, data) =>
    {
        if(err){
            return next(createError(400, err))
        }   
        else if(data){
            let user = {
                username: req.user.name,
                password: req.user.password,
                name: data.name,
                id: data.id,
                phoneNumber: data.phoneNumber
            }
            res.json({user: user})
    }})
}

const findTenant = (req, res, next) => {
    tenantModel.findOne({userID: req.user._id}, (err, data) =>
    {
        if(err){
            return next(createError(400, err))
        }   
        else if(data){
            let user = {
                username: req.user.name,
                password: req.user.password,
                name: data.name,
                id: data.id,
                phoneNumber: data.phoneNumber
            }
            res.json({user: user})
    }})
}

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
}

//Register
router.post(`/Users/register/student`, upload.none(), checkUserNotExists, createStudent) 
//LogIn
router.post(`/Users/login`, upload.none(), checkUserExists, checkLogIn, logInUser) 

//check Log in
router.get('/Users/checkLogIn', checkUserLogged, (req, res) => {
    res.json({email:req.decodedToken.email, accessLevel:req.decodedToken.accessLevel, token: req.headers.authorization})
})
//Drop Database
router.post(`/Users/resetUsers`, eliminateCollection, createAdmin)
//Log out
router.post(`/Users/logout`, (req,res) => {       
    res.json({})
})
//Update profile
router.put(`/Users/profile`, checkUserLogged, findUser, updateProfile)