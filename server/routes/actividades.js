const router = require(`express`).Router()
const actividadModel = require(`../models/actividad`)
const actividadImagenModel = require(`../models/actividad_imagen`)
const comandaModel = require(`../models/comanda`)
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
var urlencode = require('urlencode')

//this is for multipart form data
const multer  = require('multer')
const { request } = require('express')
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

const findActividad = (req, res, next) =>
{
    actividadModel.findOne({nombre: req.body.nombre}, (error, data) =>{
        if(error){
            console.log(error)
        }else{
            if(data){
                req.user = data
                return next()
            }else
                return next(createError(400, "Actividad not found."))
        } 
    })
}

const addProperty = (req, res, next) =>
{
    let property = new Object()
    property.tenant = req.body.tenant
    property.address = req.body.address
    property.area = req.body.area
    property.price = req.body.price
    property.residents = []
    property.images = []

    req.files.map((file, index) =>
    {
        property.images[index] = {filename:`${file.filename}`}
    })

    propertiesModel.create(property, (error, data) =>
    {
        if(error){
            return next(createError(400, `Error on property creation.`))
        }else{
            res.json(data)
        }
        
    })
}


const addActividad = (req, res, next) => 
{
        // var actividad = {
        //     nombre:req.body.nombre,
        //     descripcion:req.body.descripcion,
        // }

    let actividad = new Object()
    actividad.nombre = req.body.nombre
    actividad.descripcion = req.body.descripcion

    actividadModel.create(actividad, (error, data) =>
    {
        if(error){
            // return next(createError(400, `Error on actividad creation.`))
            return next(err)
        }else{
            res.json(data)
        }
        
    })
}

// router.get(`/actividades/find`, findActividad)
router.post(`/actividades/add`, upload.none(), addActividad)


module.exports = router