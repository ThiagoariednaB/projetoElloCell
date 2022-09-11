const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { response } = require('express')

router.post('/cadastro', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error, error })
    }
    conn.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [req.body.email],
      (error, resultado) => {
        if (error) {
          return res.status(500).send({ error: error })
        }
        if (resultado.length > 0) {
          res.status(401).send({ mensagem: 'Usuario já cadastrado' })
        } else {
          bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
            if (errBcrypt) {
              return res.status(500).send({ error: errBcrypt })
            }
            conn.query(
              'INSERT INTO usuarios (email, senha) VALUES (?,?)',
              [req.body.email, hash],
              (error, resultado) => {
                conn.release()
                if (error) {
                  return res.status(500).send({ error: error })
                }
                response = {
                  mensagem: 'Usuario criado com sucesso',
                  usuarioCriado: {
                    id_usuario: resultado.insertId,
                    email: req.body.email
                  }
                }
                return res.status(201).send({ response })
              }
            )
          })
        }
      }
    )
  })
})

router.post('/login', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error){ return res.status(500).send({error: error})}
    const query = 'SELECT * FROM usuarios WHERE email = ?'
    conn.query(query,[req.body.email],(error, resultado, fields) => {
      conn.release()
      if(error) { return res.status(500).send({error: error})}
      if(resultado.length < 1) {
        return res.status(401).send({mensagem: 'Falha na autentificação'})
      }
      bcrypt.compare(req.body.senha, resultado[0].senha, (err, resultado) => {
        if(err) {
          return res.status(401).send({mensagem: 'Falha na autenticação'})
        }
        if(resultado) {
          const token = jwt.sign({

          }, process.env.JWT_KEY,
          {
            expiresIn: "1h"
          })
          return res.status(200).send({mensagem: 'Autenticado com sucesso', token: token})
        }
        return res.status(401).send({mensagem: 'Falha na autenticação2'})
      })
    })
  })
})
module.exports = router
