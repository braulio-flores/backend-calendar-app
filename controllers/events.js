const { response } = require("express");
//ESTO ES PARA QUE PODAMOS TENER EL INTELLICENSE

const Event = require("../models/Events");

//! ESTE ES EL PRIMER CONTROLADOR DE CREAR NUEVO EBENTO
const createEvent = async (req, res = response) => {

  const event = new Event(req.body);

  try {

    event.user = req.uid;
    // LE INDICAMOS EL UID DEL USER, ESTE UID LO GUARDAMOS EN EL REQ CUANDO PASA POR EL VALIDATE TOKEN

    const eventDB = await event.save();
    res.status(200).json({
      ok: true,
      msg: "Event Created",
      eventDB
      
    });

  } catch (error) {

    // console.log(error);
    res.status(500).json({
      ok: true,
      msg: "Event Creation failed",
      req
    });

  }

};

//! ESTE ES EL CONTROLADOR PARA OBTENER UN EVENTO
const getEvent = async (req, res = response) => {
  try {
    const idEvent = req.params.id;
    let findEvent = await Event.findById({ idEvent });
    if (!findEvent) {
      return res.status(400).json({
        ok: false,
        msg: "The event doesn't exist",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Show Event",
      event: findEvent,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      ok: false,
      msg: "An error ocurred while find your event",
    });
  }
};

//! ESTE ES EL CONTROLADOR PARA OBTENER LOS EVENTOS
const getEvents = async (req, res = response) => {

  try {
    const events = await Event.find()
                              .populate('user','name');

    return res.status(200).json({
      ok: true,
      msg: "Show Events",
      events
    });

  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "The events couldn´t be loaded",
    });
  }

};

//! ESTE ES EL CONTROLADOR PARA ACTUALIZAR LOS EVENTOS
const updateEvents = async (req, res = response) => {

  const idEvent = req.params.id;

  try {

    const evento = await Event.findById(idEvent);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "The Event doesn´t exist",
      });
    }

    // SI EL USUARIO NO ES EL PROPIETARIO
    if (evento.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "You can't upload this event",
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: req.uid
    }

    const eventUpdated = await Event.findByIdAndUpdate(idEvent, nuevoEvento, {new:true});


    res.status(200).json({
      ok: true,
      msg: "Event Updated",
      eventUpdated
    });
    
  } catch (error) {

    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: "The Event couldn´t be Updated",
    });
  }

  
};

//! ESTE ES EL CONTROLADOR PARA ACTUALIZAR LOS EVENTOS
const deleteEvent = async (req, res = response) => {

  const idEvent = req.params.id;

  try {

    const findEvent = await Event.findById(idEvent);

    if (!findEvent) {
      return res.status(404).json({
        ok: false,
        msg: "The event doesn´t exist",
      });
    }

    if (findEvent.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "You can´t delete this event",
      });
    }

    await Event.findByIdAndDelete(idEvent);

    return res.status(200).json({
      ok: true,
      msg: "Evenmt deleted",
    });

    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "The event could´t be deleted",
    });
  }

};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvents,
  deleteEvent,
};
