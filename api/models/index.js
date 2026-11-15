const Administrador = require('./adminModel.js')
const Consultorio = require('./consultorioModel.js')
const Disponibilidad = require('./disponibilidadModel.js')
const Especialidad = require('./especialidadModel.js')
const Factura = require('./facturaModel.js')
const HistorialClinico = require('./historialclinicoModel.js')
const FichaClinica = require('./FichaClinica.model.js')
const Medico = require('./medicoModel.js')
const MedicoPaciente = require('./MedicoPaciente.model.js')
const MetodoPago = require('./metodopagoModel.js')
const Notificacion = require('./notificacionModel.js')
const ObraSocial = require('./obrasocialModel.js')
const Paciente = require('./pacienteModel.js')
const Pago = require('./pagoModel.js')
const RecetaMedica = require('./recetamedicaModel.js')
const Reserva = require('./reservaModel.js')
const SalaEspera = require('./salaesperaModel.js')
const User = require('./User.model.js')
const Turno = require('./turnoModel.js')
const Bitacora = require('./bitacoraModel.js')
const Ubicacion = require('./ubicacionModel.js')

User.hasOne(Paciente, { foreignKey: 'id_usuario', constraints: false });
Paciente.belongsTo(User, { foreignKey: 'id_usuario', constraints: false });

User.hasOne(Medico, { foreignKey: 'id_usuario', constraints: false });
Medico.belongsTo(User, { foreignKey: 'id_usuario', constraints: false });

User.hasOne(Administrador, { foreignKey: 'id_usuario', constraints: false });
Administrador.belongsTo(User, { foreignKey: 'id_usuario', constraints: false });

Medico.hasMany(Paciente, { foreignKey: 'id_medico', constraints: false });
Paciente.belongsTo(Medico, { foreignKey: 'id_medico', constraints: false });

Medico.belongsToMany(Especialidad, {
    through: 'Medico_Especialidad',
    foreignKey: 'id_medico',
    otherKey: 'id_especialidad',
    constraints: false
});
Especialidad.belongsToMany(Medico, {
    through: 'Medico_Especialidad',
    foreignKey: 'id_especialidad',
    otherKey: 'id_medico',
    constraints: false
});

Medico.hasMany(Turno, { foreignKey: 'id_medico', constraints: false });
Turno.belongsTo(Medico, { foreignKey: 'id_medico', constraints: false });

User.hasMany(Turno, { foreignKey: 'id_paciente', constraints: false });
Turno.belongsTo(User, { foreignKey: 'id_paciente', constraints: false });

Consultorio.hasMany(Turno, { foreignKey: 'id_consultorio', constraints: false });
Turno.belongsTo(Consultorio, { foreignKey: 'id_consultorio', constraints: false });

User.hasMany(HistorialClinico, { foreignKey: 'id_usuario', constraints: false });
HistorialClinico.belongsTo(User, { foreignKey: 'id_usuario', constraints: false });

Medico.hasMany(HistorialClinico, { foreignKey: 'id_medico', constraints: false });
HistorialClinico.belongsTo(Medico, { foreignKey: 'id_medico', constraints: false });

MetodoPago.hasMany(Pago, { foreignKey: 'id_metodo_pago', constraints: false });
Pago.belongsTo(MetodoPago, { foreignKey: 'id_metodo_pago', constraints: false });

Turno.hasOne(Pago, { foreignKey: 'id_turno', constraints: false });
Pago.belongsTo(Turno, { foreignKey: 'id_turno', constraints: false });

Pago.hasOne(Factura, { foreignKey: 'id_pago', constraints: false });
Factura.belongsTo(Pago, { foreignKey: 'id_pago', constraints: false });

Ubicacion.hasMany(Consultorio, { foreignKey: 'id_ubicacion', constraints: false });
Consultorio.belongsTo(Ubicacion, { foreignKey: 'id_ubicacion', constraints: false });

Consultorio.hasMany(SalaEspera, { foreignKey: 'id_consultorio', constraints: false });
SalaEspera.belongsTo(Consultorio, { foreignKey: 'id_consultorio', constraints: false });

User.hasMany(Bitacora, { foreignKey: 'id_usuario', constraints: false });
Bitacora.belongsTo(User, { foreignKey: 'id_usuario', constraints: false });

module.exports = { 
    User, Turno, Bitacora, Administrador, Consultorio, Disponibilidad, Especialidad, Factura, HistorialClinico, FichaClinica, Medico, MedicoPaciente, MetodoPago, Notificacion, ObraSocial, Paciente, Pago, RecetaMedica, Reserva, SalaEspera, Ubicacion
}