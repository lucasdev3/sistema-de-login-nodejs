const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const app = express();

const port = process.env.PORT || 3001;

// setando o motor de views
app.set('view engine', 'ejs');

// setando local dos arquivos estáticos
app.use(express.static(__dirname + '/public'));

// para processar os dados do formulario de login/registro
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// setando as variaveis de ambiente
dotenv.config({path: './env/.env'});

app.use(cookieParser());

// chamando as rotas
app.use('/', require(__dirname + '/routes/router'));

// Para eliminar o cache e para que não se possa voltar com o botão de voltar do navegador quando fazemos o Logout
app.use(function (req, res, next) {
    if(!req.user) {
        res.header('Cache-Control', 'private', 'no-cache', 'no-store', 'must-revalidate');
    }
    next();
});


app.listen(port, () => {
    console.log(`SERVER UP running in http:localhost/${port}`);
});

