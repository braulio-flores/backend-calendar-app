const { response } = require("express");
// MIDDLEWARE PARA VALIDAR EL TOKEN QUE NO HAYA SIDO ALTERADO Y QUE ESTE VALIDO
const jwt = require('jsonwebtoken');

const validateToken = (req, res = response, next) => {
  
    // LO PEDIRE EN x-token de LOS HEADERS 
    const token = req.header('x-token');
    if (!token) { //SI NO HAY TOKEN O NO ESTA VALIDADO
        return res.status(401).json({
            ok:false,
            msg: 'There´s no a valid token in the request'
        })
    }

    
    try {
        
        const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);

        
        const { uid, name } = payload;

        req.uid = uid;
        req.name = name;

    } catch (error) {
        // CATCH QUE SE DISPARA UNICAMENTE SI LA VALIDACION DE TOKEN FALLA
        return res.status(401).json({
            ok:false,
            msg: 'Token no valid'
        })
    }

  next();


};

module.exports = validateToken;
