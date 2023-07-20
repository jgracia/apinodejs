var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var app = express();

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.use(express.json());
app.use(cors());

//Establecemos los prámetros de conexión
var conexion = mysql.createConnection({
    host:'hl1030.dinaserver.com',
    user:'onlyc_JAVA',
    password:'onlyc_JAVA2023',
    database:'onlyc_JAVA'
});

//Conexión a la database
conexion.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log("¡Conexión exitosa a la base de datos!");
    }
});

app.get('/', function(req,res){
    res.send('Ruta INICIO');
});

//Mostrar todos los registros de fotos
app.get('/api/faces', (req,res)=>{
    conexion.query('SELECT * FROM facePersona', (error,filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
});

// Mostrar un solo registro
app.get('/api/faces/:id', (req,res)=>{
    conexion.query('SELECT * FROM facePersona WHERE idPK = ?', [req.params.id], (error,fila)=>{
        if(error){
            throw error;
        }else{
            res.send(fila);
        }
    })
});

// Crear registro face
app.post('/api/faces', (req,res)=>{
    let data = {cedula:req.body.cedula, nombre:req.body.nombre, apellido:req.body.apellido, estado:req.body.estado}
    let sql = "INSERT INTO facePersona SET ?"
    conexion.query(sql, data, function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    })
})

// Editar registro face
app.put('/api/faces/:id', (req, res)=> {
    let id = req.params.id
    let cedula = req.body.cedula
    let nombre = req.body.nombre
    let apellido = req.body.apellido
    let estado = req.body.estado
    let sql = "UPDATE facePersona SET cedula = ?, nombre = ?, apellido = ?, estado = ? WHERE idPK = ?"
    conexion.query(sql, [cedula, nombre, apellido, estado, id], function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    })
})

// Eliminar registro face
app.delete('/api/faces/:id', (req, res)=>{
    conexion.query("DELETE FROM facePersona WHERE idPK = ?", [req.params.id], function(error, filas){
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
})

const puerto = process.env.PUERTO || 3000;
app.listen(puerto, function(){
    console.log("Servidor Ok en puerto:"+puerto);
});
