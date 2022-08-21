const { request, response } = require("express")
const { ObjectId } = require('mongoose').Types

const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async(termino = '', res = response)=>{

    const esMongoID = ObjectId.isValid( termino )

    if( esMongoID ){
        const usuario = await Usuario.findById(termino)
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        })
    }

    const regex = new RegExp( termino, 'i' )

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({
            $or: [{ nombre: regex }, { correo: regex }],
            $and: [{ estado: true }]
        }),
        Usuario.find( { 
            $or: [{ nombre: regex }, { correo: regex }],
            $and: [{ estado: true }]
        } )
    ])

    res.json({
        total,
        results: usuarios
    })
}

const buscarCategorias = async (termino = '', res = response)=>{
    const esMongoID = ObjectId.isValid( termino )

    if( esMongoID ){
        const categoria = await Categoria.findById(termino)
                                         .populate('usuario', 'nombre')
        return res.status(200).json(categoria)
    }

    const regex = new RegExp( termino )
    const query = {
        nombre: regex,
        estado: true
    }
    const categorias = Categoria.find(query)
                                .populate('usuario','nombre')

    res.status(200).json(categorias)
}

const buscarProductos = async(termino = '', res = response)=>{

    const esMongoID = ObjectId.isValid( termino )

    if( esMongoID ){
        const producto = await Producto.findById(termino)
                                       .populate('usuario', 'nombre')
                                       .populate('categoria', 'nombre')
        
        return res.status(200).json(producto)
    }

    const regex = new RegExp(termino, 'i')
    const query = {
        nombre: regex,
        estado: true
    }

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
    ])
    
    res.status(200).json({
        total,
        results: productos
    })

}

const buscar = ( req = request, res = response )=>{

    const { coleccion, termino } = req.params

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
            break;
        case 'categorias':
            buscarCategorias(termino, res)
            break;
        case 'productos':
            buscarProductos(termino, res)
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            });
    }


}


module.exports = {
    buscar
}