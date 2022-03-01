const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "153.92.6.1",
    user:"u202105582_sistema_login",
    password: "150402AaA-",
    database: "u202105582_sistema_login",
    port: 3306,
})


connection.connect((error) => {
    if(error) {
        console.log("Erro de conexão: " + error);
    }else {
        console.log("Conectado com sucesso a base de dados");
    }
})

module.exports = connection;

