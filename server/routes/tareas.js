const router = require(`express`).Router()
const adminModel = require(`../models/admin`)
const tareaModel = require(`../models/tarea`)
const actividadModel = require(`../models/actividad`)
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

const addTarea = (req, res, next) => {
    let tarea = new Object()
    tarea.nombre = req.body.nombre
    tarea.descripcion = req.body.descripcion
    tarea.type = req.body.type;
    tarea.alumno = req.body.alumno
    tarea.alumnoID = req.body.alumnoID
    tarea.fechaInicio = req.body.fechaInicio
    tarea.fechaFinal = req.body.fechaFinal
    tarea.completado = false
    tarea.enlaceVideo = req.body.enlaceVideo
    tarea.enlaceAudio = req.body.enlaceAudio
    tarea.feedbackAlum = ''
    tarea.feedbackProf = ''

    tareaModel.create(tarea, (err, data) => {
        if (err) {
            // return next(createError(400, `Error on tarea creation.`))
            return next(err)
        } else {
            res.json(data)
        }
    })
}

const AddAsignarActividad = (req, res, next) => {
    let tarea = new Object()
    // tarea.nombre = "default";
    // tarea.descripcion = "default";

    // actividadModel.findOne({ nombre: req.body.nombre }, { enlaceVideo: 0, enlaceAudio: 0 }, (err, getData) => {
    actividadModel.findOne({ _id: req.body.actividad }, { }, (err, getData) => {
        if (err) {
            console.log(err)
            return next(err)
        } else {
            if (getData) {
                tarea.nombre = getData.nombre;
                tarea.descripcion = getData.descripcion;// + "\n " + req.body.adicional;
                // console.log("++Ess: " + getData.nombre + "\n Y es: " + getData.descripcion + "\n Añadiendo eso de: " + req.body.adicional)
                tarea.type = getData.type;
                tarea.alumno = req.body.alumno
                tarea.alumnoID = req.body.alumnoID
                tarea.fechaInicio = req.body.fechaInicio
                tarea.fechaFinal = req.body.fechaFinal
                tarea.completado = false
                // tarea.actividad = req.body.actividad
                tarea.enlaceVideo = getData.enlaceVideo
                tarea.enlaceAudio = getData.enlaceAudio
                tarea.feedbackAlum = ''
                tarea.feedbackProf = ''
                console.log("Nueva tarea para: " + tarea.alumno + " con la actividad " + tarea.nombre + ":\n " + tarea.descripcion)
                tareaModel.create(tarea, (err, data) => {
                    if (err) {
                        // return next(createError(400, `Error on tarea creation.`))
                        return next(err)
                    } else {
                        res.json(data)
                    }
                })


            } else
                return next(createError(400, "Activity not found."))
        }
    })
    // tarea.nombre = getData.nombre;
    // tarea.descripcion = getData.descripcion + " " + req.body.adicional;
    // tarea.alumno = req.body.alumno
    // tarea.alumnoID = req.body.alumnoID
    // tarea.fechaInicio = req.body.fechaInicio
    // tarea.fechaFinal = req.body.fechaFinal
    // tarea.completado = false
    // tarea.type = 1
    // tarea.actividad = req.body.actividad
    // tareaModel.create(tarea, (err, data) => {
    //     if (err) {
    //         // return next(createError(400, `Error on tarea creation.`))
    //         return next(err)
    //     } else {
    //         res.json(data)
    //     }
    // })
}

const getTareas = (req, res, next) => {
    tareaModel.find({}, { descripcion: 0 }, (err, data) => {
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

const findIDTarea = (req, res, next) => {
    tareaModel.findOne({ _id: req.params.id }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            if (data) {
                res.json(data)
                return next()
            } else
                return next(createError(400, "Activity not found."))
        }
    })
}
const findNameTarea = (req, res, next) => {
    tareaModel.findOne({ nombre: req.body.nombre }, (err, data) => {
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
    tareaModel.findByIdAndRemove({ _id: req.params.id }, (err, data) => {
        if (err)
            return next(createError(400, err))
        if (data)
            res.json({ data: data })
    })
}

const updateTarea = (req, res, next) => {
    var tarea
    tareaModel.findOneAndUpdate({ _id: req.params.id }, { nombre: req.body.nombre, descripcion: req.body.descripcion, enlaceAudio: req.body.enlaceAudio, enlaceVideo: req.body.enlaceVideo, feedbackProf: req.body.feedbackProf, feedbackAlum: req.body.feedbackAlum }, { returnNewDocument: true }, (err, data) => {
        if (err)
            return next(createError(400, err))
        if (data)
            tarea = data
    })
    res.json({ tarea: tarea })
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

router.post(`/tareas/AddAsignarActividad`, upload.none(), AddAsignarActividad)
router.post(`/tareas/add`, upload.none(), addTarea)
router.get(`/tareas/getAll`, getTareas)
router.get(`/tareas/findByID/:id`, findIDTarea)
router.get(`/tareas/findByName/:id`, findNameTarea)
router.delete(`/tareas/delete/:id`, deleteAct)
router.put(`/tareas/update/:id`, updateTarea)
router.post(`/tareas/imgAdd`, upload.none(), ImgUpp)

module.exports = router
