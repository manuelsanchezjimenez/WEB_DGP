const router = require(`express`).Router()
const actividadModel = require(`../models/actividad`)
const actividadImagenModel = require(`../models/actividad_imagen`)
const comandaModel = require(`../models/comanda`)
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
var urlencode = require('urlencode')

//this is for multipart form data
const multer = require('multer')
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

// const addProperty = (req, res, next) =>
// {
//     let property = new Object()
//     property.tenant = req.body.tenant
//     property.address = req.body.address
//     property.area = req.body.area
//     property.price = req.body.price
//     property.residents = []
//     property.images = []
//     req.files.map((file, index) =>
//     {
//         property.images[index] = {filename:`${file.filename}`}
//     })
//     propertiesModel.create(property, (error, data) =>
//     {
//         if(error){
//             return next(createError(400, `Error on property creation.`))
//         }else{
//             res.json(data)
//         }
//     })
// }

const addActividad = (req, res, next) => {
    let actividad = new Object()
    actividad.nombre = req.body.nombre
    actividad.descripcion = req.body.descripcion
    actividad.enlaceVideo = req.body.enlaceVideo
    actividad.enlaceAudio = req.body.enlaceAudio
    actividadModel.create(actividad, (error, data) => {
        if (err) {
            // return next(createError(400, `Error on actividad creation.`))
            return next(err)
        } else {
            res.json(data)
        }

    })
}

const getActividades = (req, res, next) => {
    actividadModel.find({}, (error, data) => {
        if (error) {
            console.log(error)
        } else {
            if (data) {
                res.json(data);
                return res;
            } else
                return next(createError(400, "Activities not found."))
        }
    })

}

const findActividad = (req, res, next) => {
    actividadModel.findOne({ _id: req.body.id }, (error, data) => {
        if (error) {
            console.log(error)
        } else {
            if (data) {
                req.user = data
                return next()
            } else
                return next(createError(400, "Activity not found."))
        }
    })
}

const deleteAct = (req, res, next) => {
    actividadModel.findByIdAndRemove({ _id: req.params.id }, (err, data) => {
        if (err)
            return next(createError(400, err))
        if (data)
            res.json({ data: data })
    })
}

const updateActividad = (req, res, next) => {
    var actividad
    actividadModel.findOneAndUpdate({ _id: req.body.id }, { nombre: req.body.nombre, descripcion: req.body.descripcion, enlaceAudio: req.body.enlaceAudio, enlaceVideo: req.body.enlaceVideo }, { returnNewDocument: true }, (err, data) => {
        if (err)
            return next(createError(400, err))
        if (data)
            actividad = data
    })
    res.json({ usuario: usuario })
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

router.post(`/actividades/add`, upload.none(), addActividad)
router.get(`/actividades/getAll`, getActividades)
router.get(`/actividades/:id`, findActividad)
router.delete(`/actividades/delete/:id`, deleteAct)
router.put(`/actividades/update`, updateActividad)


module.exports = router
