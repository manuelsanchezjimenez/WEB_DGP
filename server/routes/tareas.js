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
    tarea.fechaInicio = req.body.fechaInicio
    tarea.fechaFinal = req.body.fechaFinal
    tarea.completado = false
    tarea.alumno = req.body.alumno
    tarea.type = req.body.type
    tareaModel.create(tarea, (err, data) => {
        if (err) {
            // return next(createError(400, `Error on tarea creation.`))
            return next(err)
        } else {
            res.json(data)
        }
    })
}

const addTareaActividad = (req, res, next) => {
    let tarea = new Object()
    // tarea.nombre = "default";
    // tarea.descripcion = "default";
    var getData;
    actividadModel.findOne({ _id: req.body.actividad }, { enlaceVideo: 0, enlaceAudio: 0 }, (err, getData) => {
        if (err) {
            console.log(err)
            return next(err)
        } else {
            if (getData) {
                tarea.nombre = getData.nombre;
                tarea.descripcion = getData.descripcion + "\n " + req.body.adicional;
                console.log("++Ess: " + getData.nombre + "\n Y es: " + getData.descripcion + "\n Añadiendo eso de: " + req.body.adicional)
                // tarea.nombre = getData.nombre;
                // tarea.descripcion = getData.descripcion + " " + req.body.adicional;
                tarea.alumno = req.body.alumno
                tarea.alumnoID = req.body.alumnoID
                tarea.fechaInicio = req.body.fechaInicio
                tarea.fechaFinal = req.body.fechaFinal
                tarea.completado = false
                tarea.type = 1
                tarea.actividad = req.body.actividad
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
    tareaModel.findOne({ _id: req.body.id }, (err, data) => {
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
    tareaModel.findOneAndUpdate({ _id: req.body.id }, { nombre: req.body.nombre, descripcion: req.body.descripcion, enlaceAudio: req.body.enlaceAudio, enlaceVideo: req.body.enlaceVideo }, { returnNewDocument: true }, (err, data) => {
        if (err)
            return next(createError(400, err))
        if (data)
            tarea = data
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


router.post(`/tareas/addTareaActividad`, upload.none(), addTareaActividad)
router.get(`/tareas/getAll`, getTareas)
router.get(`/tareas/findByID/:id`, findIDTarea)
router.get(`/tareas/findByName/:id`, findNameTarea)
router.delete(`/tareas/delete/:id`, deleteAct)
router.put(`/tareas/update`, updateTarea)
// router.post(`/tareas/imgAdd`, upload.none(), ImgUpp)

module.exports = router
