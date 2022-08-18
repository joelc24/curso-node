const { request, response } = require("express");


const esAdminRole = (req = request, resp = response, next)=>{
    if( !req.usuario ){
        return resp.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        })
    }
    const { rol, nombre } = req.usuario

    if( rol !== 'ADMIN_ROLE' ){
        return resp.status(401).json({
            msg: `${nombre} no es administrador - no puede pasar`
        })
    }

    next()

}

const tieneRole = (...roles)=>{
    return (req = request, resp = response, next)=>{

        if( !req.usuario ){
            return resp.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }

        if(!roles.includes(req.usuario.rol)){
            return resp.status(401).json({
                msg: `El servicio require uno de estos roles ${ roles }`
            })
        }

        next()
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}