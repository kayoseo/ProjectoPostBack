var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var pgp = require('pg-promise')(/* options */)
var db = pgp('postgres://localhost:5432/prueba')

let postDeleted=[];


var app = express();
app.use(cors());

/* var index=require('./index'); */
//rutas

//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//cors
app.options('*', cors()) // include before other routes

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE'),
    res.header("Access-Control-Allow-Credentials", true);
    ;
    next();
});

//rutas
app.get('/post', (req, res) => {
    db.any('SELECT name,description from post')
        .then(function (data) {
            res.status(200).send({
                message: data
            })
        })
        .catch(function (error) {
            console.log('ERROR:', error)
        })

})
app.post('/post', (req, res) => {
    db.query('insert into post (name, description, dateCreate) values ($1, $2,CURRENT_DATE)', [req.body.name, req.body.description])
        .then(function (data) {
            res.status(200).send({
                name: req.body.name, description: req.body.description
            })
        })
        .catch(function (error) {
            console.log('ERROR:', error)
            if (error.code === "23505") {
                res.status(409).send({
                    error: `Ya existe un post con nombre: ${req.body.name}`
                })
            }
            res.status(409).send({
                message: error.detail
            })
        })

})

app.delete('/post', (req, res) => {

    db.any('SELECT name,description from post where name=$1', req.body.name)
        .then(function (data) {
            if (data.length > 0) {
                postDeleted = data;
            }
            db.query('delete from post where name=$1', [req.body.name])
                .then(function (data) {
                    res.status(200).send({
                        postDeleted
                    })
                })
                .catch(function (error) {
                    console.log('ERROR:', error)
                    res.status(409).send({
                        message: error.detail
                    })
                })
        })
        .catch(function (error) {
            console.log('ERROR:', error)
        })


})

//exportart
module.exports = app;