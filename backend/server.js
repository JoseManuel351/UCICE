require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');  

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error fatal al conectar a la base de datos:', err.message);
        return;
    }
    console.log('✅ Conexión exitosa a la base de datos: sistema_ucice');
});

// ==========================================
// SEGURIDAD Y LOGIN
// ==========================================
const JWT_SECRET = process.env.JWT_SECRET || 'ucice_super_secreto_2026';

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

app.post('/api/auth/registro', async (req, res) => {
    try {
        const { nombre_completo, correo, password_plano, rol } = req.body;
        const rolSeguro = (rol === 'Admin' || !rol) ? 'Público General' : rol;
        const hash = await bcrypt.hash(password_plano, 10);
        
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

app.post('/api/auth/login', (req, res) => {
    const { correo, password } = req.body;
    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        if (results.length === 0) return res.status(401).json({ error: 'Credenciales incorrectas' });

        const usuario = results[0];
        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) return res.status(401).json({ error: 'Credenciales incorrectas' });

        const token = jwt.sign(
            { id: usuario.id_usuario, nombre: usuario.nombre_completo, rol: usuario.rol }, 
            JWT_SECRET, 
            { expiresIn: '8h' }
        );

        res.json({ mensaje: 'Bienvenido', token, usuario: { id: usuario.id_usuario, nombre: usuario.nombre_completo, rol: usuario.rol } });
    });
});

app.get('/api/carreras', (req, res) => {
    db.query('SELECT * FROM catalogo_carreras', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al cargar carreras' });
        res.json(results);
    });
});

// ==========================================
// CURSOS
// ==========================================
app.get('/api/cursos', (req, res) => {
    db.query('SELECT * FROM cursos_capacitacion ORDER BY fecha_creacion DESC', (err, results) => res.json(results));
});

app.post('/api/cursos', (req, res) => {
    const { titulo, descripcion, fecha_inicio, enlace_inscripcion, estatus } = req.body;
    db.query(`INSERT INTO cursos_capacitacion (titulo, descripcion, fecha_inicio, enlace_inscripcion, estatus) VALUES (?, ?, ?, ?, ?)`, 
    [titulo, descripcion, fecha_inicio || null, enlace_inscripcion, estatus || 'Borrador'], (err) => res.json({ mensaje: 'Curso registrado' }));
});

app.put('/api/cursos/:id', (req, res) => {
    const { titulo, descripcion, fecha_inicio, enlace_inscripcion, estatus } = req.body;
    db.query(`UPDATE cursos_capacitacion SET titulo = ?, descripcion = ?, fecha_inicio = ?, enlace_inscripcion = ?, estatus = ? WHERE id_curso = ?`, 
    [titulo, descripcion, fecha_inicio || null, enlace_inscripcion, estatus, req.params.id], (err) => res.json({ mensaje: 'Curso actualizado.' }));
});

app.delete('/api/cursos/:id', (req, res) => {
    db.query('DELETE FROM cursos_capacitacion WHERE id_curso = ?', [req.params.id], (err) => res.json({ mensaje: 'Curso eliminado.' }));
});

// ==========================================
// EMPRESAS NODESS
// ==========================================
app.get('/api/nodess', (req, res) => {
    db.query('SELECT * FROM empresas_nodess ORDER BY fecha_registro DESC', (err, results) => res.json(results));
});

app.post('/api/nodess', (req, res) => {
    const { nombre_comercial, representante, telefono, correo_contacto, direccion } = req.body;
    db.query(`INSERT INTO empresas_nodess (nombre_comercial, representante, telefono, correo_contacto, direccion) VALUES (?, ?, ?, ?, ?)`, 
    [nombre_comercial, representante, telefono, correo_contacto, direccion], (err) => res.json({ mensaje: 'Registrada' }));
});

app.put('/api/nodess/estatus/:id', (req, res) => {
    db.query('UPDATE empresas_nodess SET estatus = ? WHERE id_empresa = ?', [req.body.estatus, req.params.id], (err) => res.json({ mensaje: 'Actualizada' }));
});

// ==========================================
// NOTICIAS
// ==========================================
const storageNoticias = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/noticias/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const uploadNoticias = multer({ storage: storageNoticias });

app.get('/api/noticias', (req, res) => {
    db.query(`SELECT n.*, u.nombre_completo AS autor, (SELECT JSON_ARRAYAGG(ruta_archivo) FROM galeria_noticias WHERE id_noticia = n.id_noticia) AS galeria FROM noticias_micrositio n JOIN usuarios u ON n.id_usuario_autor = u.id_usuario ORDER BY n.fecha_publicacion DESC`, 
    (err, results) => res.json(results));
});

app.post('/api/noticias', uploadNoticias.array('imagenes', 10), (req, res) => {
    const { id_usuario_autor, titulo, contenido, estatus } = req.body;
    const rutaPortada = req.files && req.files.length > 0 ? `/uploads/noticias/${req.files[0].filename}` : null;
    
    db.query(`INSERT INTO noticias_micrositio (id_usuario_autor, titulo, contenido, imagen_portada, estatus) VALUES (?, ?, ?, ?, ?)`, 
    [id_usuario_autor, titulo, contenido, rutaPortada, estatus || 'Borrador'], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error' });
        if (req.files && req.files.length > 1) { 
            const valoresGaleria = req.files.slice(1).map(file => [results.insertId, `/uploads/noticias/${file.filename}`]);
            db.query(`INSERT INTO galeria_noticias (id_noticia, ruta_archivo) VALUES ?`, [valoresGaleria]);
        }
        res.json({ mensaje: 'Publicada' });
    });
});

app.delete('/api/noticias/:id', (req, res) => {
    db.query('DELETE FROM noticias_micrositio WHERE id_noticia = ?', [req.params.id], () => res.json({ mensaje: 'Eliminada' }));
});

// ==========================================
// EVIDENCIAS
// ==========================================
const storageEvidencias = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/evidencias/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-evidencia-' + file.originalname)
});
const uploadEvidencia = multer({ storage: storageEvidencias });

app.get('/api/evidencias', (req, res) => {
    db.query(`SELECT e.*, u.nombre_completo AS autor, u.rol FROM evidencias e JOIN usuarios u ON e.id_usuario = u.id_usuario ORDER BY e.fecha_registro DESC`, 
    (err, results) => res.json(results));
});

app.post('/api/evidencias', uploadEvidencia.single('archivo'), (req, res) => {
    const { id_usuario, titulo, descripcion, fecha_actividad } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Falta archivo.' });

    db.query(`INSERT INTO evidencias (id_usuario, titulo, descripcion, fecha_actividad, ruta_archivo) VALUES (?, ?, ?, ?, ?)`,
    [id_usuario, titulo, descripcion, fecha_actividad, `/uploads/evidencias/${req.file.filename}`], (err) => res.json({ mensaje: 'Subida con éxito' }));
});

app.put('/api/evidencias/estatus/:id', (req, res) => {
    db.query('UPDATE evidencias SET estatus = ? WHERE id_evidencia = ?', [req.body.estatus, req.params.id], (err) => res.json({ mensaje: `Actualizado` }));
});

// ==========================================
// MERCADITO (INTELIGENTE: BUSCA O CREA ESTUDIANTE)
// ==========================================
const storageMercadito = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/mercadito/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-mercadito-' + file.originalname)
});
const uploadMercadito = multer({ storage: storageMercadito });

app.get('/api/mercadito', (req, res) => {
    const querySQL = `
        SELECT sm.*, emp.nombre_emprendimiento, emp.tipo_producto_servicio, emp.descripcion_venta, emp.redes_sociales, emp.imagen_producto,
        est.nombre_completo AS estudiante, est.correo_estudiante, est.numero_contacto, c.nombre_carrera
        FROM solicitudes_mercadito sm
        JOIN emprendimientos emp ON sm.id_emprendimiento = emp.id_emprendimiento
        JOIN estudiantes est ON emp.id_estudiante = est.id_estudiante
        JOIN catalogo_carreras c ON est.id_carrera = c.id_carrera
        ORDER BY sm.fecha_solicitud DESC;
    `;
    db.query(querySQL, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error interno' });
        res.json(results);
    });
});

app.post('/api/mercadito/registro', uploadMercadito.single('imagen'), (req, res) => {
    const { id_carrera, nombre_completo, correo_estudiante, numero_contacto, nombre_emprendimiento, tipo_producto_servicio, descripcion_venta, redes_sociales, cantidad_mesas, requiere_electricidad, lleva_estructura, descripcion_estructura } = req.body;
    
    const rutaImagen = req.file ? `/uploads/mercadito/${req.file.filename}` : null;

    // Función auxiliar para continuar el registro una vez que tenemos el ID del estudiante
    const continuarRegistro = (idEstudiante) => {
        db.query(`INSERT INTO emprendimientos (id_estudiante, nombre_emprendimiento, tipo_producto_servicio, descripcion_venta, redes_sociales, imagen_producto) VALUES (?, ?, ?, ?, ?, ?)`, 
        [idEstudiante, nombre_emprendimiento, tipo_producto_servicio, descripcion_venta, redes_sociales, rutaImagen], (err, resEmp) => {
            if (err) {
                console.error('❌ Error SQL en emprendimientos:', err.message);
                return res.status(500).json({ error: 'Error al registrar emprendimiento' });
            }
            const idEmprendimiento = resEmp.insertId;
            
            db.query(`INSERT INTO solicitudes_mercadito (id_emprendimiento, cantidad_mesas, requiere_electricidad, lleva_estructura, descripcion_estructura, estatus_solicitud) VALUES (?, ?, ?, ?, ?, 'Pendiente')`, 
            [idEmprendimiento, cantidad_mesas, requiere_electricidad, lleva_estructura, descripcion_estructura], (err) => {
                if (err) {
                    console.error('❌ Error SQL en solicitudes:', err.message);
                    return res.status(500).json({ error: 'Error al registrar logística' });
                }
                res.json({ mensaje: 'Solicitud enviada' });
            });
        });
    };

    // PASO 1: Buscar si el estudiante ya existe por su correo
    db.query('SELECT id_estudiante FROM estudiantes WHERE correo_estudiante = ?', [correo_estudiante], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al consultar estudiante' });

        if (results.length > 0) {
            // El estudiante YA EXISTE, usamos su ID
            continuarRegistro(results[0].id_estudiante);
        } else {
            // El estudiante NO EXISTE, lo creamos nuevo
            db.query(`INSERT INTO estudiantes (id_carrera, nombre_completo, correo_estudiante, numero_contacto) VALUES (?, ?, ?, ?)`, 
            [id_carrera, nombre_completo, correo_estudiante, numero_contacto], (err, resEst) => {
                if (err) {
                    console.error('❌ Error SQL en estudiantes:', err.message);
                    return res.status(500).json({ error: 'Error al registrar estudiante' });
                }
                continuarRegistro(resEst.insertId);
            });
        }
    });
});

app.put('/api/mercadito/aprobar/:id', (req, res) => {
    db.query("UPDATE solicitudes_mercadito SET estatus_solicitud = 'Aprobada' WHERE id_solicitud = ?", [req.params.id], (err) => res.json({ mensaje: 'Aprobada' }));
});

app.put('/api/mercadito/rechazar/:id', (req, res) => {
    db.query("UPDATE solicitudes_mercadito SET estatus_solicitud = 'Rechazada' WHERE id_solicitud = ?", [req.params.id], (err) => res.json({ mensaje: 'Rechazada' }));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Backend corriendo en http://localhost:${PORT}`);
});