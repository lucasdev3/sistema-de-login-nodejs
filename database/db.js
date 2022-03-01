const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
})


connection.connect((error) => {
    if(error) {
        console.log("Erro de conexão: " + error);
    }else {
        console.log("Conectado com sucesso a base de dados");
    }
})

module.exports = connection;

