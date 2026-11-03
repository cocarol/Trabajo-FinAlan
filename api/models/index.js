const Administrador = require('./adminModel.js')
const Consultorio = require('./consultorioModel.js')
const Disponibilidad = require('./disponibilidadModel.js')
const Especialidad = require('./especialidadModel.js')
const Factura = require('./facturaModel.js')
const HistorialClinico = require('./historialclinicoModel.js')
const Medico = require('./medicoModel.js')
const MetodoPago = require('./metodopagoModel.js')
const Notificacion = require('./notificacionModel.js')
const ObraSocial = require('./obrasocialModel.js')
const Paciente = require('./pacienteModel.js')
const Pago = require('./pagoModel.js')
const RecetaMedica = require('./recetamedicaModel.js')
const Reserva = require('./reservaModel.js')
const SalaEspera = require('./salaesperaModel.js')
const User = require('./User.model.js')
// const Usuario_ObraSocial = require('./usuarioObraSocialModel.js');
const Turno = require('./turnoModel.js')
const Bitacora = require('./bitacoraModel.js')
const Ubicacion = require('./ubicacionModel.js')

User.hasOne(Paciente, { foreignKey: 'id_usuario' });
Paciente.belongsTo(User, { foreignKey: 'id_usuario' });

User.hasOne(Medico, { foreignKey: 'id_usuario' });
Medico.belongsTo(User, { foreignKey: 'id_usuario' });

User.hasOne(Administrador, { foreignKey: 'id_usuario' });
Administrador.belongsTo(User, { foreignKey: 'id_usuario' });

Medico.hasMany(Paciente, { foreignKey: 'id_medico' });
Paciente.belongsTo(Medico, { foreignKey: 'id_medico' });

Medico.belongsToMany(Especialidad, {
    through: 'Medico_Especialidad',
    foreignKey: 'id_medico',
    otherKey: 'id_especialidad'
});
Especialidad.belongsToMany(Medico, {
    through: 'Medico_Especialidad',
    foreignKey: 'id_especialidad',
    otherKey: 'id_medico'
});

//USUARIO OBRA SOCIAL

Medico.hasMany(Turno, { foreignKey: 'id_medico' });
Turno.belongsTo(Medico, { foreignKey: 'id_medico' });

User.hasMany(Turno, { foreignKey: 'id_paciente' });
Turno.belongsTo(User, { foreignKey: 'id_paciente' });

Consultorio.hasMany(Turno, { foreignKey: 'id_consultorio' });
Turno.belongsTo(Consultorio, { foreignKey: 'id_consultorio' });

User.hasMany(HistorialClinico, { foreignKey: 'id_usuario' });
HistorialClinico.belongsTo(User, { foreignKey: 'id_usuario' });

Medico.hasMany(HistorialClinico, { foreignKey: 'id_medico' });
HistorialClinico.belongsTo(Medico, { foreignKey: 'id_medico' });

MetodoPago.hasMany(Pago, { foreignKey: 'id_metodo_pago' });
Pago.belongsTo(MetodoPago, { foreignKey: 'id_metodo_pago' });

Turno.hasOne(Pago, { foreignKey: 'id_turno' });
Pago.belongsTo(Turno, { foreignKey: 'id_turno' });

Pago.hasOne(Factura, { foreignKey: 'id_pago' });
Factura.belongsTo(Pago, { foreignKey: 'id_pago' });

Ubicacion.hasMany(Consultorio, { foreignKey: 'id_ubicacion' });
Consultorio.belongsTo(Ubicacion, { foreignKey: 'id_ubicacion' });

Consultorio.hasMany(SalaEspera, { foreignKey: 'id_consultorio' });
SalaEspera.belongsTo(Consultorio, { foreignKey: 'id_consultorio' });

User.hasMany(Bitacora, { foreignKey: 'id_usuario' });
Bitacora.belongsTo(User, { foreignKey: 'id_usuario' });

module.exports = { 
    User, Turno, Bitacora, Administrador, Consultorio, Disponibilidad, Especialidad, Factura, HistorialClinico, Medico, MetodoPago, Notificacion, ObraSocial, Paciente, Pago, RecetaMedica, Reserva, SalaEspera, Ubicacion, /*Usuario_ObraSocial*/
} 