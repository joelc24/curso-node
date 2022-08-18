const { request, response } = require('express')
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')

const login = async(req = request, resp= response)=>{

    const { correo, password } = req.body

    try {
        
        //Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo })
        if (!usuario) {
            return resp.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }
        //verificar si el usuario esta activo
        if (!usuario.estado) {
            return resp.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }
        //verificar la contraseña
        const validPassword = await bcrypt.compareSync(password, usuario.password)
        if (!validPassword) {
            return resp.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }
        //Generar el JWT
        const token = await generarJWT( usuario.id )
        resp.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        return resp.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

    
}

const googleSignIn = async (req = request, resp = response)=>{

    const { id_token } = req.body
    //console.log(id_token)

    try {
        const { correo, nombre, img } = await googleVerify( id_token )
        
        //buscar Usuario
        let usuario = await Usuario.findOne({ correo })

        if( !usuario ){
            const data = {
                nombre,
                correo,
                password: '123456',
                img,
                google: true,
                rol: 'USER_ROLE'
            }

            usuario = new Usuario( data )
            await usuario.save()
        }

        //si el usuario en DB
        if( !usuario.estado ){
            return resp.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }


        //Generar el JWT
        const token = await generarJWT( usuario.id )
        resp.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        resp.status(400).json({
            msg: 'Token de googlw no es valido'
        })
    }

    
}

module.exports = {
    login,
    googleSignIn
}