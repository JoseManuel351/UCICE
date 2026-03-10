require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');  

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// CONEXIÓN A MYSQL
// ==========================================
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error fatal al conectar a la base de datos:', err.message);
        return;
    }
    console.log('Conexión exitosa a la base de datos: sistema_ucice');
});

// ==========================================
// RUTAS: SEGURIDAD Y LOGIN (CON ROLES)
// ==========================================
const JWT_SECRET = process.env.JWT_SECRET || 'ucice_super_secreto_2026';

// 1. RUTA TEMPORAL: Crear al primer Administrador
app.post('/api/auth/crear-admin-maestro', async (req, res) => {
    try {
        const { nombre_completo, correo, password_plano } = req.body;
        const hash = await bcrypt.hash(password_plano, 10);
        
        db.query(`INSERT INTO usuarios (nombre_completo, correo, password, rol) VALUES (?, ?, ?, 'Admin')`, 
        [nombre_completo, correo, hash], (err) => {
            if (err) return res.status(500).json({ error: 'El correo ya existe.' });
            res.json({ mensaje: 'Admin maestro creado con éxito.' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al encriptar' });
    }
});

// 2. NUEVA RUTA: Registro Público con Selección de Perfil
app.post('/api/auth/registro', async (req, res) => {
    try {
        const { nombre_completo, correo, password_plano, rol } = req.body;
        
        // FILTRO DE SEGURIDAD ESTRICTO: Bloqueamos cualquier intento de inyectar 'Admin'
        const rolSeguro = (rol === 'Admin' || !rol) ? 'Público General' : rol;

        // Encriptamos la contraseña
        const hash = await bcrypt.hash(password_plano, 10);
        
        // Guardamos en MySQL con el rol que el usuario eligió (o el filtrado)
        db.query(`INSERT INTO usuarios (nombre_completo, correo, password, rol) VALUES (?, ?, ?, ?)`, 
        [nombre_completo, correo, hash, rolSeguro], (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Este correo ya está registrado.' });
                return res.status(500).json({ error: 'Error al registrar.' });
            }
            res.json({ mensaje: '¡Registro exitoso! Ya puedes iniciar sesión.' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// 3. RUTA OFICIAL: Iniciar Sesión (Login) Actualizada
app.post('/api/auth/login', (req, res) => {
    const { correo, password } = req.body;

    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        if (results.length === 0) return res.status(401).json({ error: 'Credenciales incorrectas' });

        const usuario = results[0];
        
        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) return res.status(401).json({ error: 'Credenciales incorrectas' });

        // AHORA EL GAFETE INCLUYE EL ROL DEL USUARIO
        const token = jwt.sign(
            { id: usuario.id_usuario, nombre: usuario.nombre_completo, rol: usuario.rol }, 
            JWT_SECRET, 
            { expiresIn: '8h' }
        );

        res.json({ 
            mensaje: 'Bienvenido', 
            token, 
            usuario: { id: usuario.id_usuario, nombre: usuario.nombre_completo, rol: usuario.rol } 
        });
    });
});

// ==========================================
// RUTAS: CATÁLOGOS GLOBALES
// ==========================================
app.get('/api/carreras', (req, res) => {
    db.query('SELECT * FROM catalogo_carreras', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al cargar carreras' });
        res.json(results);
    });
});

// ==========================================
// RUTAS: CURSOS DE CAPACITACIÓN
// ==========================================
app.get('/api/cursos', (req, res) => {
    db.query('SELECT * FROM cursos_capacitacion ORDER BY fecha_creacion DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al cargar los cursos' });
        res.json(results);
    });
});

app.post('/api/cursos', (req, res) => {
    const { titulo, descripcion, fecha_inicio, enlace_inscripcion, estatus } = req.body;
    const querySQL = `INSERT INTO cursos_capacitacion (titulo, descripcion, fecha_inicio, enlace_inscripcion, estatus) VALUES (?, ?, ?, ?, ?)`;
    
    db.query(querySQL, [titulo, descripcion, fecha_inicio || null, enlace_inscripcion, estatus || 'Borrador'], (err) => {
        if (err) return res.status(500).json({ error: 'Error al guardar el curso' });
        res.json({ mensaje: '¡Curso registrado con éxito!' });
    });
});

app.put('/api/cursos/:id', (req, res) => {
    const { titulo, descripcion, fecha_inicio, enlace_inscripcion, estatus } = req.body;
    const querySQL = `UPDATE cursos_capacitacion SET titulo = ?, descripcion = ?, fecha_inicio = ?, enlace_inscripcion = ?, estatus = ? WHERE id_curso = ?`;
    
    db.query(querySQL, [titulo, descripcion, fecha_inicio || null, enlace_inscripcion, estatus, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el curso' });
        res.json({ mensaje: 'Curso actualizado correctamente.' });
    });
});

app.delete('/api/cursos/:id', (req, res) => {
    db.query('DELETE FROM cursos_capacitacion WHERE id_curso = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el curso' });
        res.json({ mensaje: 'Curso eliminado del sistema.' });
    });
});

// ==========================================
// RUTAS: MERCADITO
// ==========================================
app.get('/api/mercadito', (req, res) => {
    const querySQL = `
        SELECT 
            sm.*, 
            emp.nombre_emprendimiento,
            emp.tipo_producto_servicio,
            emp.descripcion_venta,
            emp.redes_sociales,
            est.nombre_completo AS estudiante,
            est.correo_estudiante,
            est.numero_contacto,
            c.nombre_carrera
        FROM solicitudes_mercadito sm
        JOIN emprendimientos emp ON sm.id_emprendimiento = emp.id_emprendimiento
        JOIN estudiantes est ON emp.id_estudiante = est.id_estudiante
        JOIN catalogo_carreras c ON est.id_carrera = c.id_carrera
        ORDER BY sm.fecha_solicitud DESC;
    `;
    db.query(querySQL, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error interno del servidor' });
        res.json(results);
    });
});

app.post('/api/mercadito/registro', (req, res) => {
    const { 
        id_carrera, nombre_completo, correo_estudiante, numero_contacto, 
        nombre_emprendimiento, tipo_producto_servicio, descripcion_venta, redes_sociales,
        cantidad_mesas, requiere_electricidad, lleva_estructura, descripcion_estructura 
    } = req.body;

    const sqlEst = `INSERT INTO estudiantes (id_carrera, nombre_completo, correo_estudiante, numero_contacto) VALUES (?, ?, ?, ?)`;
    db.query(sqlEst, [id_carrera, nombre_completo, correo_estudiante, numero_contacto], (err, resEst) => {
        if (err) return res.status(500).json({ error: 'Error al registrar estudiante' });
        const idEstudiante = resEst.insertId;

        const sqlEmp = `INSERT INTO emprendimientos (id_estudiante, nombre_emprendimiento, tipo_producto_servicio, descripcion_venta, redes_sociales) VALUES (?, ?, ?, ?, ?)`;
        db.query(sqlEmp, [idEstudiante, nombre_emprendimiento, tipo_producto_servicio, descripcion_venta, redes_sociales], (err, resEmp) => {
            if (err) return res.status(500).json({ error: 'Error al registrar emprendimiento' });
            const idEmprendimiento = resEmp.insertId;

            const sqlSol = `INSERT INTO solicitudes_mercadito (id_emprendimiento, cantidad_mesas, requiere_electricidad, lleva_estructura, descripcion_estructura, estatus_solicitud) VALUES (?, ?, ?, ?, ?, 'Pendiente')`;
            db.query(sqlSol, [idEmprendimiento, cantidad_mesas, requiere_electricidad, lleva_estructura, descripcion_estructura], (err) => {
                if (err) return res.status(500).json({ error: 'Error al registrar logística' });
                res.json({ mensaje: 'Solicitud enviada con éxito' });
            });
        });
    });
});

app.put('/api/mercadito/aprobar/:id', (req, res) => {
    db.query("UPDATE solicitudes_mercadito SET estatus_solicitud = 'Aprobada' WHERE id_solicitud = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar' });
        res.json({ mensaje: '¡Solicitud aprobada con éxito!' });
    });
});

app.put('/api/mercadito/rechazar/:id', (req, res) => {
    db.query("UPDATE solicitudes_mercadito SET estatus_solicitud = 'Rechazada' WHERE id_solicitud = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar' });
        res.json({ mensaje: 'Solicitud rechazada en el sistema.' });
    });
});

// ==========================================
// RUTAS: EMPRESAS NODESS
// ==========================================
app.get('/api/nodess', (req, res) => {
    db.query('SELECT * FROM empresas_nodess ORDER BY fecha_registro DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener empresas' });
        res.json(results);
    });
});

app.get('/api/nodess/:id', (req, res) => {
    const querySQL = `
        SELECT id_empresa, nombre_comercial, representante, telefono, correo_contacto, direccion 
        FROM empresas_nodess 
        WHERE id_empresa = ? AND (estatus = 'Activa' OR estatus IS NULL)
    `;
    db.query(querySQL, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al cargar los datos de la empresa' });
        if (results.length === 0) return res.status(404).json({ error: 'Empresa no encontrada o dada de baja.' });
        res.json(results[0]);
    });
});

app.post('/api/nodess', (req, res) => {
    const { nombre_comercial, representante, telefono, correo_contacto, direccion } = req.body;
    db.query(`INSERT INTO empresas_nodess (nombre_comercial, representante, telefono, correo_contacto, direccion) VALUES (?, ?, ?, ?, ?)`, 
    [nombre_comercial, representante, telefono, correo_contacto, direccion], (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: `La empresa ya está registrada.` });
            return res.status(500).json({ error: 'Error interno al guardar' });
        }
        res.json({ mensaje: '¡Empresa NODESS registrada con éxito!' });
    });
});

app.put('/api/nodess/estatus/:id', (req, res) => {
    db.query('UPDATE empresas_nodess SET estatus = ? WHERE id_empresa = ?', [req.body.estatus, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el estatus' });
        res.json({ mensaje: `La empresa ahora está ${req.body.estatus}.` });
    });
});

// ==========================================
// RUTAS: NOTICIAS
// ==========================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/noticias/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

app.get('/api/noticias', (req, res) => {
    db.query(`SELECT n.*, u.nombre_completo AS autor FROM noticias_micrositio n JOIN usuarios u ON n.id_usuario_autor = u.id_usuario ORDER BY n.fecha_publicacion DESC`, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al cargar las noticias' });
        res.json(results);
    });
});

app.get('/api/noticias/:id', (req, res) => {
    db.query(`SELECT n.*, u.nombre_completo AS autor FROM noticias_micrositio n JOIN usuarios u ON n.id_usuario_autor = u.id_usuario WHERE n.id_noticia = ?`, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al cargar la noticia' });
        if (results.length === 0) return res.status(404).json({ error: 'Noticia no encontrada' });
        res.json(results[0]);
    });
});

app.post('/api/noticias', upload.array('imagenes', 10), (req, res) => {
    const { id_usuario_autor, titulo, contenido, estatus } = req.body;
    const rutaPortada = req.files && req.files.length > 0 ? `/uploads/noticias/${req.files[0].filename}` : null;
    
    db.query(`INSERT INTO noticias_micrositio (id_usuario_autor, titulo, contenido, imagen_portada, estatus) VALUES (?, ?, ?, ?, ?)`, 
    [id_usuario_autor, titulo, contenido, rutaPortada, estatus || 'Borrador'], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al guardar la noticia' });
        const idNoticiaNueva = results.insertId;
        if (req.files && req.files.length > 0) {
            const valoresGaleria = req.files.map(file => [idNoticiaNueva, `/uploads/noticias/${file.filename}`]);
            db.query(`INSERT INTO galeria_noticias (id_noticia, ruta_archivo) VALUES ?`, [valoresGaleria], (errGaleria) => {
                if (errGaleria) console.error('Error en galería:', errGaleria.message);
            });
        }
        res.json({ mensaje: '¡Noticia publicada con éxito!' });
    });
});

app.put('/api/noticias/:id', upload.array('imagenes', 10), (req, res) => {
    const { titulo, contenido, estatus } = req.body;
    if (req.files && req.files.length > 0) {
        db.query('UPDATE noticias_micrositio SET titulo = ?, contenido = ?, estatus = ?, imagen_portada = ? WHERE id_noticia = ?', 
        [titulo, contenido, estatus, `/uploads/noticias/${req.files[0].filename}`, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar' });
            res.json({ mensaje: 'Noticia actualizada correctamente.' });
        });
    } else {
        db.query('UPDATE noticias_micrositio SET titulo = ?, contenido = ?, estatus = ? WHERE id_noticia = ?', 
        [titulo, contenido, estatus, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar' });
            res.json({ mensaje: 'Noticia actualizada correctamente.' });
        });
    }
});

app.delete('/api/noticias/:id', (req, res) => {
    db.query('DELETE FROM noticias_micrositio WHERE id_noticia = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar la noticia' });
        res.json({ mensaje: 'Noticia eliminada correctamente del sistema.' });
    });
});

// Encender servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});