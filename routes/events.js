/* 
    RUTAS DE EVENTS /events
    MAIN: host + /api/events
*/
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { createEvent, getEvents, updateEvents, deleteEvent, getEvent } = require("../controllers/events");
const { isDate } = require("../helpers/isDate");
const validateFields = require("../middlewares/validate-campos");
const validateToken = require("../middlewares/validate-token");

// TODAS DEBEN DE PASAR POR LA VALIDACION DEL JWT
router.use(validateToken); 

//ROUTA PARA UN NUEVO EVENTO
router.post("/", [
    check('title', 'The title is required').not().isEmpty(),
    check('start', 'Start Date is required in a correct format').custom( isDate ),
    check('end', 'Eend Date is required in a correct format').custom( isDate ),
    validateFields,    
], createEvent);

//ROUTA PARA OBTENER TODOS LOS EVENTOS
router.get("/", [], getEvents);

//ROUTA PARA OBTENER TODOS LOS EVENTOS
router.get("/:id", [], getEvent);

//ROUTA PARA ACTUALIZAR UN EVENTO
router.put("/:id", [], updateEvents);

//ROUTA PARA ELIMINAR UN EVENTO
router.delete("/:id", [], deleteEvent);

module.exports = router;
