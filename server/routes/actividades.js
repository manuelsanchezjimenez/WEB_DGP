const router = require(`express`).Router()
const actividadModel = require(`../models/actividad`)
const actividadImagenModel = require(`../models/actividad_imagen`)
// const comandaModel = require(`../models/comanda`)
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

const addActividad = (req, res, next) => {
    let actividad = new Object()
    actividad.nombre = req.body.nombre
    actividad.descripcion = req.body.descripcion
    actividad.enlaceVideo = req.body.enlaceVideo
    actividad.enlaceAudio = req.body.enlaceAudio
    actividadModel.create(actividad, (err, data) => {
        if (err) {
            // return next(createError(400, `Error on actividad creation.`))
            return next(err)
        } else {
            res.json(data)
        }

    })
}

const getActividades = (req, res, next) => {
    actividadModel.find({}, { descripcion: 0, enlaceVideo: 0, enlaceAudio: 0 }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            if (data) {
                res.json(data);
                return res;
            } else
                return next(createError(400, "Activities not found."))
        }
    })

}

const findIDActividad = (req, res, next) => {
    actividadModel.findOne({ _id: req.body.id }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            if (data) {
                req.user = data
                return next()
            } else
                return next(createError(400, "Activity not found."))
        }
    })
}
const findNameActividad = (req, res, next) => {
    actividadModel.findOne({ nombre: req.body.nombre }, (err, data) => {
        if (err) {
            console.log(err)
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

const checkUserLogged = (req, res, next) => {
    jwt.verify(req.headers.authorization, process.env.JWT_PRIVATE_KEY, { algorithm: "HS256" }, (err, decodedToken) => {
        if (err) {
            return next(createError(400, "User is not logged in."))
        }
        else {
            req.decodedToken = decodedToken
            return next()
        }
    })
}

const ImgUpp = (req, res, next) => {

    let actividad_imagen = new Object();
    actividad_imagen.actividad = req.body.actividad;
    actividad_imagen.orden = req.body.orden;
    actividad_imagen.imagen = req.body.imagen;

    actividadImagenModel.create(actividad_imagen, (err, data) => {
        if (err) {
            return next(err)
        }
        res.json(data)
    })
}

router.post(`/actividades/add`, upload.none(), addActividad)
router.get(`/actividades/getAll`, getActividades)
router.get(`/actividades/findByID/:id`, findIDActividad)
router.get(`/actividades/findByName/:id`, findNameActividad)
router.delete(`/actividades/delete/:id`, deleteAct)
router.put(`/actividades/update`, updateActividad)
router.post(`/actividades/imgAdd`, upload.none(), ImgUpp)

module.exports = router
