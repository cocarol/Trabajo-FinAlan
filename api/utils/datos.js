const bcrypt = require('bcrypt');
const { User, Turno, Especialidad, ObraSocial, Paciente, Medico, MedicoPaciente, FichaClinica } = require('../models/index');
const { calcularDVH, calcularDVV } = require('./digitosVerificadores');
const { sellarUsuario } = require('./integridadUsuario');

const cargarDatosIniciales = async () => {
    try {
        if (ObraSocial) await ObraSocial.sync({ alter: true }).catch(() => {});
        if (Especialidad) await Especialidad.sync({ alter: true }).catch(() => {});
        if (Paciente) await Paciente.sync({ alter: true }).catch(() => {});
        if (Medico) await Medico.sync({ alter: true }).catch(() => {});
        if (MedicoPaciente) await MedicoPaciente.sync({ alter: true }).catch(() => {});
        if (FichaClinica) await FichaClinica.sync({ alter: true }).catch(() => {});
        if (Turno) await Turno.sync({ alter: true }).catch(() => {});

        const adminExistente = await User.findOne({ where: { role: 'admin' } });
        const cantidadTurnos = await Turno.count();
        if (adminExistente && cantidadTurnos > 0) return;

        console.log("Generando datos de prueba...");
        const passwordHash = await bcrypt.hash('123', 11);

        const especialidades = ['Cardiología', 'Pediatría', 'Dermatología', 'Traumatología'];
        for (const nombre of especialidades) {
            try {
                await Especialidad.findOrCreate({ 
                    where: { nombre_especialidad: nombre },
                    defaults: { descripcion_especialidad: `Atención en ${nombre}` }
                });
            } catch (e) {
                console.log("Aviso catálogo especialidad:", e.message);
            }
        }

        const obras = ['OSDE', 'Swiss Medical', 'Galeno', 'IOMA'];
        for (const nombre of obras) {
            try {
                if (ObraSocial) {
                    await ObraSocial.findOrCreate({
                        where: { nombre_obrasocial: nombre },
                        defaults: { telefono_obrasocial: 48001234, plan_obrasocial: 'Plan 210' }
                    });
                }
            } catch (e) {
                await ObraSocial.sync({ force: true }).catch(() => {});
            }
        }

        const usuariosPrueba = [
            { name: 'María Fava', email: 'fava@admin.com', password: passwordHash, role: 'admin', dni: '20000000' },
            { name: 'Claudio', email: 'claudio@medico.com', password: passwordHash, role: 'medico', dni: '30000000' },
            { name: 'Guillermo Rok', email: 'guillermo@medico.com', password: passwordHash, role: 'medico', dni: '30000001' },
            { name: 'Juan', email: 'juan@gmail.com', password: passwordHash, role: 'paciente', dni: '40000000' },
            { name: 'Piris', email: 'piris@gmail.com', password: passwordHash, role: 'paciente', dni: '48855220' }
        ];

        const usuariosCreados = [];
        for (const userData of usuariosPrueba) {
            let user = await User.findOne({ where: { email: userData.email } });
            if (!user) {
                user = await User.create(userData);
            } else if (!user.dni) {
                user.dni = userData.dni;
            }
            sellarUsuario(user);
            await user.save();
            usuariosCreados.push(user);

            try {
                if (user.role === 'medico' && Medico) {
                    const existeMed = await Medico.findOne({ where: { id_usuario: user.id_usuario } });
                    if (!existeMed) {
                        await Medico.create({
                            id_usuario: user.id_usuario,
                            DNI_usuario: Number(user.dni) || 30000000,
                            nombre_usuario: user.name,
                            edad_usuario: 40,
                            especialidad: 'Cardiología',
                            matricula: 'MN-' + user.id_usuario
                        });
                    }
                } else if (user.role === 'paciente' && Paciente) {
                    const existePac = await Paciente.findOne({ where: { id_usuario: user.id_usuario } });
                    if (!existePac) {
                        await Paciente.create({
                            id_usuario: user.id_usuario,
                            obra_social: 'OSDE',
                            numero_afiliado: '00-' + user.dni,
                            telefono: '1144556677'
                        });
                    }
                }
            } catch (e) {
                console.log("Aviso perfil secundario:", e.message);
            }
        }

        const medicoClaudio = usuariosCreados.find(u => u.email === 'claudio@medico.com') || usuariosCreados.find(u => u.role === 'medico');
        const pacienteJuan = usuariosCreados.find(u => u.email === 'juan@gmail.com') || usuariosCreados.find(u => u.role === 'paciente');
        const idClaudio = medicoClaudio.id_usuario;
        const idJuan = pacienteJuan.id_usuario;

        try {
            if (MedicoPaciente) {
                const existeVinc = await MedicoPaciente.findOne({ where: { medicoId: idClaudio, id_paciente: idJuan } });
                if (!existeVinc) {
                    const vinculo = await MedicoPaciente.create({ medicoId: idClaudio, id_paciente: idJuan });
                    vinculo.dvh = calcularDVH({ id: vinculo.id, medicoId: idClaudio, id_paciente: idJuan });
                    vinculo.dvv = calcularDVV(vinculo.dvh, "");
                    await vinculo.save();
                }
            }
        } catch (e) {
            console.log("Aviso vínculo inicial:", e.message);
        }

        if (cantidadTurnos === 0) {
            const hoy = new Date().toISOString().split('T')[0];

            const turnosPrueba = [
                { especialidad: 'Cardiología', fecha: '2026-12-01', horario: '09:00', ubicacion: 'Consultorio 1', estado: 'Disponible', id_paciente: 0, id_medico: idClaudio },
                { especialidad: 'Cardiología', fecha: '2026-12-01', horario: '09:30', ubicacion: 'Consultorio 1', estado: 'Disponible', id_paciente: 0, id_medico: idClaudio },
                { especialidad: 'Pediatría', fecha: '2026-12-02', horario: '10:00', ubicacion: 'Consultorio 3', estado: 'Reservado', id_paciente: idJuan, id_medico: idClaudio },
                { especialidad: 'Cardiología', fecha: hoy, horario: '11:00', ubicacion: 'Consultorio 1', estado: 'Pagado', monto: 5000, id_paciente: idJuan, id_medico: idClaudio },
                { especialidad: 'Traumatología', fecha: '2026-11-02', horario: '10:00', ubicacion: 'Consultorio 3', estado: 'Reservado', id_paciente: idJuan, id_medico: idClaudio },
                { especialidad: 'Cardiología', fecha: '2026-05-10', horario: '15:00', ubicacion: 'Consultorio 2', estado: 'Confirmado', monto: 5000, id_paciente: idJuan, id_medico: idClaudio }
            ];

            for (const turnoData of turnosPrueba) {
                const turno = await Turno.create(turnoData);
                const datosFila = { id: turno.id, estado: turno.estado, id_paciente: turno.id_paciente };
                if (turno.monto) datosFila.monto = turno.monto;
                turno.dvh = calcularDVH(datosFila);
                turno.dvv = calcularDVV(turno.dvh, "");
                await turno.save();
            }
        }

        console.log("Datos de prueba cargados correctamente.");
    } catch (error) {
        console.error("Error al cargar datos de prueba:", error);
    }
};

module.exports = { cargarDatosIniciales };