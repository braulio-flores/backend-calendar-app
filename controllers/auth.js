const { response } = require("express");
//ESTO ES PARA QUE PODAMOS TENER EL INTELLICENSE

const bcrypt = require('bcryptjs');

const User = require("../models/User");
const generateJWT = require("../helpers/jwt");



//! ESTE ES EL PRIMER CONTROLADOR DE CREAR USUARIO
const createUser = async (req, res = response) => {

  const { name, email, pass } = req.body;

  try {
    let findUsuario = await User.findOne({email: email});

    if (findUsuario) {
      return res.status(400).json({
        ok: false,
        msg: "The user already exists with this email", 
      });
    }

    const usuario = new User(req.body);
    // ENCRIPTAR CONTRASEÑA
    const salt = bcrypt.genSaltSync();
    usuario.pass = bcrypt.hashSync(pass, salt);

    await usuario.save();

    // TODO GENERAR TOKEN
    const token = await generateJWT(usuario._id, usuario.name)


    res.status(200).json({
      ok: true,
      msg: "Register Successfully",
      name,
      email,
      token
    });

  } catch (error) {

    res.status(500).json({
      ok: false,
      msg: `Register failed`,
    });
    console.log(error);
  }
};

// !CONTROLADOR CORRESPONDIENTE A EL LOGGEO
const loginUser = async(req, res = response) => {
  const { email, pass } = req.body;

  try {
    let findUsuario = await User.findOne({email: email});
    // VERIFICAMOS SI HAY ALGUN USUARIO CON ESA CONTRASEÑA
    if (!findUsuario) {
      return res.status(400).json({
        ok: false,
        msg: "The mail or pass are not correct", 
      });
    }

    // CONFIRMAR LOS PASSWORDS
    const validPasswords = bcrypt.compareSync( pass, findUsuario.pass );
    if (!validPasswords) {
      return res.status(400).json({
        ok: false,
        msg: "The mail or pass are not correct", 
      });
    }

    // TODO GENERAR TOKEN
    const token = await generateJWT(findUsuario.id, findUsuario.name)


    res.status(200).json({
      ok: true,
      msg: "Login Successfull",
      uid: findUsuario.id,
      email,
      token
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "The login couldn't be done",
    });
  }


};

const renewToken = async(req, res = response) => {

  const uid = req.uid;
  const name = req.name;

  const newToken = await generateJWT(uid,name);
  res.json({
    ok: true,
    msg: "renew",
    newToken: newToken
  });
};

module.exports = {
  createUser,
  loginUser,
  renewToken,
};
