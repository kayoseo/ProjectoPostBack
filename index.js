/* var pgp = require('pg-promise')()
var db = pgp('postgres://localhost:5432/prueba') */

var app=require('./app');




app.listen(3700,()=>{
    console.log("conexion exitosa")
})

