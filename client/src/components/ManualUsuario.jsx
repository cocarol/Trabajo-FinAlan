import Layout from './Layout';

function ManualUsuario() {
    return (
        <Layout>
            <div className="manual-wrapper">
                <div className="manual-header">
                    <h1>Manual de Usuario Oficial</h1>
                    <p style={{ color: 'var(--tinta-suave)', fontSize: '1.1rem' }}>
                        Guía de uso exhaustiva del sistema <strong>Turnos Salud</strong>. Seleccione su perfil para conocer los procedimientos detallados de la plataforma.
                    </p>
                </div>

                <div className="manual-section">
                    <h2>1. Portal del Paciente</h2>
                    
                    <div className="manual-step">
                        <h4>1.1. Registro y Acceso</h4>
                        <ol style={{ color: 'var(--tinta-suave)', lineHeight: '1.6', marginBottom: '12px' }}>
                            <li>En la página principal, haga clic en <span className="manual-btn">Crear Cuenta</span>.</li>
                            <li>Complete el formulario con su Nombre, Email y una contraseña segura (mínimo 8 caracteres).</li>
                            <li>El sistema validará que su correo no exista y encriptará su clave.</li>
                            <li>Una vez registrado, utilice el botón <span className="manual-btn">Ingresar</span> para iniciar sesión.</li>
                        </ol>
                        <div className="manual-nota">
                            <strong>¿Olvidó su clave?</strong> 
                            Si no recuerda su acceso, haga clic en "Olvidé mi contraseña" en el panel de Login para recibir un enlace de recuperación seguro con validez de 15 minutos.
                        </div>
                    </div>

                    <div className="manual-step">
                        <h4>1.2. Editar Mi Perfil</h4>
                        <ul>
                            <li>Diríjase a <strong>Mi Perfil</strong> en la barra de navegación superior.</li>
                            <li>Haga clic en el botón <span className="manual-btn primario">Editar</span>.</li>
                            <li>Complete sus datos faltantes, como DNI, Obra Social, Número de Afiliado y Teléfono de contacto.</li>
                            <li>Presione <span className="manual-btn primario">Guardar Cambios</span>. Toda su información médica se guardará bajo cifrado irreversible.</li>
                        </ul>
                    </div>
                    
                    <div className="manual-step">
                        <h4>1.3. Búsqueda y Reserva de Turnos</h4>
                        <ol style={{ color: 'var(--tinta-suave)', lineHeight: '1.6', marginBottom: '12px' }}>
                            <li>Haga clic en <strong>Reservar Turno</strong> en el menú superior.</li>
                            <li>Utilice los filtros: seleccione una <strong>Especialidad</strong> y, opcionalmente, una <strong>Fecha</strong>.</li>
                            <li>Presione <span className="manual-btn primario">Buscar</span>. El sistema listará los cupos disponibles.</li>
                            <li>Identifique el horario deseado y haga clic en <span className="manual-btn primario">Reservar</span>. El turno quedará bloqueado temporalmente a su nombre.</li>
                        </ol>
                    </div>

                    <div className="manual-step">
                        <h4>1.4. Pago y Confirmación de Asistencia</h4>
                        <p>Los turnos reservados requieren un proceso de dos pasos para asegurar su validez:</p>
                        <ul>
                            <li>Vaya a la pestaña <strong>Mis Turnos</strong>.</li>
                            <li>Ubique el turno en estado <em>Reservado</em> y haga clic en <span className="manual-btn">Pagar</span>.</li>
                            <li>Seleccione su método de pago y presione <span className="manual-btn primario">Confirmar pago</span>. El sistema emitirá un comprobante con un Token electrónico y el estado pasará a <em>Pagado</em>.</li>
                            <li>Finalmente, para asegurar el cupo en el consultorio, haga clic en <span className="manual-btn primario">Confirmar</span>. El turno pasará a estado <em>Confirmado</em>.</li>
                        </ul>
                    </div>

                    <div className="manual-step">
                        <h4>1.5. Cancelar un Turno</h4>
                        <p>Si no puede asistir, vaya a <strong>Mis Turnos</strong> y presione <span className="manual-btn peligro">Cancelar</span>.</p>
                        <div className="manual-nota advertencia">
                            <strong>Regla de Cancelación (24hs):</strong> 
                            El sistema denegará automáticamente cualquier intento de cancelación si faltan menos de 24 horas para el horario de la cita médica programada.
                        </div>
                    </div>

                    <div className="manual-step">
                        <h4>1.6. Consultar Historial</h4>
                        <p>Para ver sus visitas pasadas, ingrese a <strong>Mi Perfil</strong> y seleccione la pestaña lateral <strong>Historial / Visitas</strong>. Verá un registro cronológico de todas las consultas con fecha anterior al día de hoy.</p>
                    </div>
                </div>

                <div className="manual-section">
                    <h2>2. Portal del Médico</h2>
                    
                    <div className="manual-step">
                        <h4>2.1. Panel y Lista de Pacientes</h4>
                        <ul>
                            <li>Al iniciar sesión, el profesional accederá directamente al <strong>Panel Médico</strong>.</li>
                            <li>El sistema cargará automáticamente todos los turnos <em>Pagados</em> y <em>Confirmados</em> correspondientes exclusivamente a la <strong>fecha actual (hoy)</strong>.</li>
                            <li>Los datos de los pacientes son descifrados en memoria para garantizar el secreto médico.</li>
                        </ul>
                    </div>
                    
                    <div className="manual-step">
                        <h4>2.2. Actualizar Ficha Clínica</h4>
                        <ul>
                            <li>Dentro del panel, seleccione a un paciente de la lista.</li>
                            <li>Podrá visualizar los antecedentes y registrar nuevos parámetros como <strong>peso, altura, presión y observaciones de diagnóstico</strong>.</li>
                            <li>Al guardar, el sistema generará los dígitos verificadores (DVH/DVV) para asegurar que la historia clínica no pueda ser alterada de forma externa.</li>
                        </ul>
                    </div>

                    <div className="manual-step">
                        <h4>2.3. Vincular Paciente Manualmente</h4>
                        <p>Si un paciente acude al consultorio pero no está en la lista de atención del día:</p>
                        <ol style={{ color: 'var(--tinta-suave)', lineHeight: '1.6' }}>
                            <li>Haga clic en <strong>Agregar Paciente</strong> en la barra superior.</li>
                            <li>Ingrese el <strong>DNI</strong> del paciente y busque.</li>
                            <li>Si el usuario existe en el sistema, presione <span className="manual-btn primario">Vincular</span> para agregarlo a su nómina oficial.</li>
                        </ol>
                    </div>
                </div>

                <div className="manual-section">
                    <h2>3. Portal del Administrador</h2>
                    
                    <div className="manual-step">
                        <h4>3.1. Gestión de Roles y Permisos</h4>
                        <p>Los administradores tienen la facultad de definir los accesos operativos del sistema:</p>
                        <ul>
                            <li>Navegue hacia la pestaña <strong>Roles y Usuarios</strong>.</li>
                            <li>El sistema mostrará una grilla con todos los usuarios registrados.</li>
                            <li>Utilice el menú desplegable junto al nombre de un paciente para promoverlo al rol de <strong>Médico</strong> o <strong>Administrador</strong>. (Toda promoción queda grabada de forma indeleble en la bitácora).</li>
                        </ul>
                    </div>
                    
                    <div className="manual-step">
                        <h4>3.2. Motor de Integridad y Verificación</h4>
                        <p>El sistema cuenta con un motor criptográfico para prevenir manipulaciones en la Base de Datos:</p>
                        <ol style={{ color: 'var(--tinta-suave)', lineHeight: '1.6', marginBottom: '12px' }}>
                            <li>Ingrese al panel de <strong>Integridad</strong>.</li>
                            <li>Presione el botón <span className="manual-btn primario">Escanear Base de Datos</span>.</li>
                            <li>El sistema recalculará los Dígitos Verificadores Horizontales (DVH) de cada usuario y turno, comparándolos con las firmas almacenadas.</li>
                            <li>Si un registro fue modificado directamente en la base de datos por un intruso, el sistema emitirá una alerta roja detallando la tabla y el ID del registro corrupto.</li>
                        </ol>
                    </div>

                    <div className="manual-step">
                        <h4>3.3. Auditoría y Bitácora</h4>
                        <p>El sistema registra cada acción crítica (inicios de sesión, cambios de contraseña, reservas, modificaciones de fichas, etc.) de forma invisible. Estos registros son inmutables y pueden ser consultados por la gerencia para trazar responsabilidades ante cualquier incidente.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ManualUsuario;