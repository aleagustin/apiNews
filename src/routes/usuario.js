const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// Recupero todos los Usuarios
router.get('/usuarios', (req, res) => {
  mysqlConnection.query('SELECT * FROM usuario', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

//Recupero un usuario pasando como parametro de la url ID
router.get('/usuario/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM usuario WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

//Elimino un usuario pasando como parametro de la url ID
router.delete('/usuario/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM usuario WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Usuario Eliminado'});
    } else {
      console.log(err);
    }
  });
});

// Guardo un empleado

router.post('/create/usuario', (req, res) => {
 /* const {id, email, contrasena} = req.body;
  console.log(id, email, contrasena);
  const user  = {
    email: req.body.email,
    contrasena: req.body.contrasena
  }
  const query = "INSERT INTO usuario set ?";
*/

//Esta forma es más intuitiva pero la de arriba da menos errores usando los parametros ? y creando un Modelo

email = req.body.email
contrasena = req.body.contrasena


const query = "INSERT INTO usuario (id,email,contrasena) values(null," + "'"+email+"'"+ "," + contrasena + ");";


  mysqlConnection.query(query, (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Usuario Creado'});
    } else {
      console.log(err);
    }
  });

});



router.post("/login", (req, res) => {
  
email = req.body.email
contrasena = req.body.contrasena 

const query = "select * from usuario where email=" + "'" + email + "'" + " and contrasena=" + "'" + contrasena + "';"

  mysqlConnection.query(query, (err, rows, fields) => {
    if(!err) {
      if(rows.length > 0){
        res.json(rows[0]);//Devuelvo el usuario
        console.log("El usuario existe")
      }else{
        console.log("El usuario no existe")
        res.json(null)
      }
      
    } else {
      console.log(err);
    }
  });
});



router.put('/:id', (req, res) => {
  const { name, salary } = req.body;
  const { id } = req.params;
  const query = `
    SET @id = ?;
    SET @name = ?;
    SET @salary = ?;
    CALL employeeAddOrEdit(@id, @name, @salary);
  `;
  mysqlConnection.query(query, [id, name, salary], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Employee Updated'});
    } else {
      console.log(err);
    }
  });
});


module.exports = router;