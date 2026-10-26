const bcrypt = require('bcrypt');
const { User, Turno, Especialidad } = require('../models/index');
const { calcularDVH, calcularDVV } = require('./digitosVerificadores');

const cargarDatosIniciales = async () => {
    try {
        const adminExistente = await User.findOne({ where: { role: 'admin' } });
        if (adminExistente) return;

        console.log("Generando datos de prueba");
        const passwordHash = await bcrypt.hash('123', 11);

        const especialidades = ['Cardiología', 'Pediatría', 'Dermatología', 'Traumatología'];
        for (const nombre of especialidades) {
            await Especialidad.findOrCreate({ 
                where: { nombre_especialidad: nombre },
                defaults: { descripcion_especialidad: `Atención en ${nombre}` }
            });
        }

        const usuariosPrueba = [
            { name: 'María Fava', email: 'fava@admin.com', password: passwordHash, role: 'admin' },
            { name: 'Claudio', email: 'roberto@clinica.com', password: passwordHash, role: 'medico' },
            { name: 'German', email: 'marta@clinica.com', password: passwordHash, role: 'medico' },
            { name: 'Juan', email: 'juan@gmail.com', password: passwordHash, role: 'paciente' },
            { name: 'Piris', email: 'piris@gmail.com', password: passwordHash, role: 'paciente' }
        ];

        const usuariosCreados = [];
        for (const userData of usuariosPrueba) {
            const user = await User.create(userData);
            const idReal = user.id_usuario || user.id;
            user.dvh = calcularDVH({ id: idReal, email: user.email, role: user.role });
            user.dvv = calcularDVV(user.dvh, "");
            await user.save();
            usuariosCreados.push(user);
        }

        const idJuan = usuariosCreados.find(u => u.email === 'juan@gmail.com').id_usuario || usuariosCreados.find(u => u.email === 'juan@gmail.com').id;
        
        const turnosPrueba = [
            { especialidad: 'Cardiología', fecha: '2026-12-01', horario: '09:00', ubicacion: 'Consultorio 1', estado: 'Disponible', id_paciente: null },
            { especialidad: 'Cardiología', fecha: '2026-12-01', horario: '09:30', ubicacion: 'Consultorio 1', estado: 'Disponible', id_paciente: null },
            { especialidad: 'Pediatría', fecha: '2026-12-02', horario: '10:00', ubicacion: 'Consultorio 3', estado: 'Reservado', id_paciente: idJuan }
        ];

        for (const turnoData of turnosPrueba) {
            const turno = await Turno.create(turnoData);
            turno.dvh = calcularDVH({ id: turno.id, estado: turno.estado, id_paciente: turno.id_paciente });
            turno.dvv = calcularDVV(turno.dvh, "");
            await turno.save();
        }

        console.log("Datos de prueba cargados");
    } catch (error) {
        console.error("Error al cargar datos de prueba:", error);
    }
};

module.exports = { cargarDatosIniciales };