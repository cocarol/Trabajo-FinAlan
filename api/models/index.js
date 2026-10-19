const Administrador = require('./adminModel.js')
const Consultorio = require('./consultorioModel.js')
const Disponibilidad = require('./disponibilidadModel.js')
const Especialidad = require('./diagnosticoModel.js')
const Factura = require('./facturaModel.js')
const HistorialClinico = require('./historialclinicoModel.js')
const Medico = require('./medicoModel.js')
const MetodoPago = require('./metodopagoModel.js')
const Notificacion = require('./notificacionModel.js')
const ObraSocial = require('./obrasocialModel.js')
const Pago = require('./pagoModel.js')
const RecetaMedica = require('./recetamedicaModel.js')
const Reserva = require('./reservaModel.js')
const SalaEspera = require('./salaesperaModel.js')
const Ubicacion = require('./ubicacionModel.js')
const User = require('./User.model.js')
const Turno = require('./turnoModel.js')
const Bitacora = require('./bitacoraModel.js')

Ubicacion.hasOne(SalaEspera);
SalaEspera.belongsTo(Ubicacion);

Consultorio.hasOne(Ubicacion);
Ubicacion.belongsTo(Consultorio)

Usuario.hasOne(SalaEspera);
SalaEspera.belongsTo(Usuario);

Medico.hasOne(Administrador);
Administrador.belongsTo(Medico);

Bitacora.hasOne(Administrador);
Administrador.belongsTo(Bitacora);

Usuario.hasOne(Administrador);
Administrador.belongsTo(Usuario);



module.exports = { User, Turno, Bitacora, Administrador, Consultorio, Disponibilidad, Especialidad, Factura, HistorialClinico, Medico, MetodoPago, Notificacion, ObraSocial, Pago, RecetaMedica, Reserva, SalaEspera, Ubicacion}