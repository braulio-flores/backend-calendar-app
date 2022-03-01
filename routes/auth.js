/* 
    RUTAS DE USUARIO /auth
    MAIN: host + /api/auth
*/
const express = require("express");
const { createUser, loginUser, renewToken } = require("../controllers/auth");
const router = express.Router();
const { check } = require("express-validator");
const validateFields = require("../middlewares/validate-campos");
const validateToken = require("../middlewares/validate-token");

// router.get('/', (request,response)=>{

//     response.json({
//         ok: true
//     })

// })
// ASI SE HACE ORIGINALMENTE, CON LAS SIGUIENTES FORMAS USARE CONTROLADORES PARA ACORTAR EL CODIGO

router.post(
  "/new",
  [
    // MIDDLEARES
    check("name", "The name is required").not().isEmpty(),
    check("email", "The email is required in a correct format").isEmail(),
    check("pass", "The password must be at least 6 characters").isLength({ 
      min: 6,
    }),
    validateFields, //ESTE ES MI CUSTOM MIDDLEWARE QUE SE ENCARGA DE VER SI TENGO ERRORES EN LA VALIDACION
  ],
  createUser
);
//PARA EVITAR QUE TODA LA FUNCION VAYA DENTRO DEL ROUTER USAMOS UN CONTROLLER
// COMO TERCER PARAMETRO SE LO PUEDE MANDAR UNO O VARIOS MIDDLEWARES
// EN ESTE CASO ESTAMOS APLICANDO MIDDLELWARES DE VALIDACION DE INFORMACION PASADA POR EL BODY

router.post(
  "/",
  [
    check("email", "The email is required in a correct format").isEmail(),
    check("pass", "The password must be at least 6 characters").isLength({
      min: 6,
    }),
    validateFields
  ],
  loginUser
);

router.get("/renew", validateToken ,renewToken);

module.exports = router;
