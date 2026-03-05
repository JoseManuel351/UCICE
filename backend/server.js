require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors());
app.use(express.json());
// Exponer la carpeta de imágenes estáticas para que React las pueda ver
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
        console.error('❌ Error fatal al conectar a la base de datos:', err.message);
        return;
    }
    console.log('✅ Conexión exitosa a la base de datos: sistema_ucice');
});

// ==========================================
// RUTAS: MERCADITO
// ==========================================
app.get('/api/mercadito', (req, res) => {
    const querySQL = `
        SELECT 
            sm.id_solicitud, 
            emp.nombre_emprendimiento, 
            est.nombre_completo AS estudiante, 
            c.nombre_carrera,
            sm.estatus_solicitud 
        FROM solicitudes_mercadito sm
        JOIN emprendimientos emp ON sm.id_emprendimiento = emp.id_emprendimiento
        JOIN estudiantes est ON emp.id_estudiante = est.id_estudiante
        JOIN catalogo_carreras c ON est.id_carrera = c.id_carrera;
    `;
    db.query(querySQL, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error interno del servidor' });
        res.json(results);
    });
});

app.put('/api/mercadito/aprobar/:id', (req, res) => {
    const querySQL = "UPDATE solicitudes_mercadito SET estatus_solicitud = 'Aprobada' WHERE id_solicitud = ?";
    db.query(querySQL, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar' });
        res.json({ mensaje: '¡Solicitud aprobada con éxito!' });
    });
});

app.put('/api/mercadito/rechazar/:id', (req, res) => {
    const querySQL = "UPDATE solicitudes_mercadito SET estatus_solicitud = 'Rechazada' WHERE id_solicitud = ?";
    db.query(querySQL, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar' });
        res.json({ mensaje: 'Solicitud rechazada en el sistema.' });
    });
});

// ==========================================
// RUTAS: EMPRESAS NODESS
// ==========================================
app.get('/api/nodess', (req, res) => {
    const querySQL = 'SELECT * FROM empresas_nodess ORDER BY fecha_registro DESC';
    db.query(querySQL, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error del servidor al obtener empresas' });
        res.json(results);
    });
});

app.post('/api/nodess', (req, res) => {
    const { nombre_comercial, representante, telefono, correo_contacto, direccion } = req.body;
    const querySQL = `
        INSERT INTO empresas_nodess (nombre_comercial, representante, telefono, correo_contacto, direccion) 
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(querySQL, [nombre_comercial, representante, telefono, correo_contacto, direccion], (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: `La empresa "${nombre_comercial}" ya está registrada.` });
            }
            return res.status(500).json({ error: 'Error interno al guardar en la base de datos' });
        }
        res.json({ mensaje: '¡Empresa NODESS registrada con éxito!' });
    });
});

app.put('/api/nodess/estatus/:id', (req, res) => {
    const querySQL = 'UPDATE empresas_nodess SET estatus = ? WHERE id_empresa = ?';
    db.query(querySQL, [req.body.estatus, req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el estatus' });
        res.json({ mensaje: `La empresa ahora está ${req.body.estatus}.` });
    });
});

// ==========================================
// RUTAS: NOTICIAS
// ==========================================

// 1. Configuración de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/noticias/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});
const upload = multer({ storage: storage });

// 2. LEER: Obtener noticias (GET)
app.get('/api/noticias', (req, res) => {
    const querySQL = `
        SELECT n.*, u.nombre_completo AS autor 
        FROM noticias_micrositio n
        JOIN usuarios u ON n.id_usuario_autor = u.id_usuario
        ORDER BY n.fecha_publicacion DESC
    `;
    db.query(querySQL, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al cargar las noticias' });
        res.json(results);
    });
});

// 3. CREAR: Registrar noticia (POST)
app.post('/api/noticias', upload.array('imagenes', 10), (req, res) => {
    const { id_usuario_autor, titulo, contenido, estatus } = req.body;
    const rutaPortada = req.files && req.files.length > 0 ? `/uploads/noticias/${req.files[0].filename}` : null;
    
    const queryNoticia = `INSERT INTO noticias_micrositio (id_usuario_autor, titulo, contenido, imagen_portada, estatus) VALUES (?, ?, ?, ?, ?)`;
    
    db.query(queryNoticia, [id_usuario_autor, titulo, contenido, rutaPortada, estatus || 'Borrador'], (err, results) => {
        if (err) {
            console.error('❌ Error al guardar noticia:', err.message);
            return res.status(500).json({ error: 'Error interno al guardar la noticia' });
        }
        
        const idNoticiaNueva = results.insertId;

        // Guardar Galería adicional
        if (req.files && req.files.length > 0) {
            const valoresGaleria = req.files.map(file => [idNoticiaNueva, `/uploads/noticias/${file.filename}`]);
            const queryGaleria = `INSERT INTO galeria_noticias (id_noticia, ruta_archivo) VALUES ?`;
            db.query(queryGaleria, [valoresGaleria], (errGaleria) => {
                if (errGaleria) console.error('⚠️ Error en galería:', errGaleria.message);
            });
        }
        res.json({ mensaje: '¡Noticia publicada con éxito!' });
    });
});

// 4. ACTUALIZAR: Editar noticia (PUT)
app.put('/api/noticias/:id', upload.array('imagenes', 10), (req, res) => {
    const idNoticia = req.params.id;
    const { titulo, contenido, estatus } = req.body;

    let querySQL;
    let parametros;

    if (req.files && req.files.length > 0) {
        const nuevaPortada = `/uploads/noticias/${req.files[0].filename}`;
        querySQL = 'UPDATE noticias_micrositio SET titulo = ?, contenido = ?, estatus = ?, imagen_portada = ? WHERE id_noticia = ?';
        parametros = [titulo, contenido, estatus, nuevaPortada, idNoticia];
    } else {
        querySQL = 'UPDATE noticias_micrositio SET titulo = ?, contenido = ?, estatus = ? WHERE id_noticia = ?';
        parametros = [titulo, contenido, estatus, idNoticia];
    }

    db.query(querySQL, parametros, (err, results) => {
        if (err) {
            console.error('❌ Error al actualizar noticia:', err.message);
            return res.status(500).json({ error: 'Error al actualizar en la base de datos' });
        }
        res.json({ mensaje: 'Noticia actualizada correctamente.' });
    });
});

// 5. BORRAR: Eliminar noticia (DELETE)
app.delete('/api/noticias/:id', (req, res) => {
    const idNoticia = req.params.id;
    const querySQL = 'DELETE FROM noticias_micrositio WHERE id_noticia = ?';
    
    db.query(querySQL, [idNoticia], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar la noticia' });
        res.json({ mensaje: 'Noticia eliminada correctamente del sistema.' });
    });
});

// Encender servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Backend corriendo en http://localhost:${PORT}`);
});