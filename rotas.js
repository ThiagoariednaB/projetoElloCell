const express = require('express')
const acesso = express.Router()

const url = "http://localhost:3000/produtos"

function getprodutosResultados() {
  axios.get(url)
  .then(response =>{
    const data = response.data
    produtosw.textContent = JSON.stringify(data)
    console.log(response)
  })
  .catch(error => console.log(error))
}

getprodutosResultados()

module.exports = acesso
