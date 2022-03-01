const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const connection = require('../database/db')
const {promisify} = require('util')


// procedimento para registro
exports.register = async (req, res) => {

    try {
        const name = req.body.name;
        const user = req.body.user;
        const pass = req.body.pass;

        let passHash = await bcryptjs.hash(pass, 8)
        //console.log(passHash)

        connection.query('INSERT INTO users SET ?', {user: user, name: name, pass: passHash}, (error, results) => {
            if(error) {
                console.log(error);
            }else {
                res.redirect('/')
            }
        })
    } catch (error) {
        console.log(error)
    }
}

exports.login = async (req, res) => {
    try {
        
        const user = req.body.user;
        const pass = req.body.pass;

        if (!user || !pass) {
            res.render('login', {
                alert: true,
                alertTitle: "Atenção",
                alertMessage: "Insira um usuario e senha válidos",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: undefined ,
                ruta: 'login'
            })
        }else {
            connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
                if ( results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass)) ) {
                    res.render('login', {
                        alert: true,
                        alertTitle: "Atenção",
                        alertMessage: "Insira um usuario e senha válidos",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: undefined,
                        ruta: 'login'
                    })
                }else {
                    // inicio da sessao ok
                    const id = results[0].id
                    const token = jwt.sign({id: id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TEMPO_EXPIRACAO
                    })
                    // console.log("TOKEN GERADO: " + token + " para o usuario " + user)

                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRACAO * 24 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)
                    res.render('login', {
                        alert: true,
                        alertTitle: "Conexão bem sucedida",
                        alertMessage: "Login Realizado",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 1000,
                        ruta: ''
                    })
                }
            })
        }

    } catch (error) {
        console.log(error);
    }
}

exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoficada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            connection.query('SELECT * FROM users WHERE id = ?', [decoficada.id], (error, results) => {
                if (!results) {
                    return next()
                }else {
                    req.user = results[0]
                    return next()
                }
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }else {
        res.redirect('/login')
        return next()
    }
}

exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/')
}
    
