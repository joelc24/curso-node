const { Categoria, Producto } = require('../models')
const  Role = require('../models/role')
const Usuario = require('../models/usuario')

const esRoleValido = async(rol = '')=>{
    const existeRol = await Role.findOne({ rol })
    if (!existeRol) {
        throw new Error(`El rol ${ rol } no esta registrado en la base de datos`)
    }
}

const emailExiste = async(correo = '')=>{
    const existEmail = await Usuario.findOne({correo})
    if (existEmail) {
        throw new Error(`El correo: ${ correo }, ya esta registrado`)
    }
}

const existeUsuarioPorId = async (id)=>{
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${ id }`)
    }
}

const existeCategoria = async(id = '')=>{
    const existCategoria = await Categoria.findById(id)

    if (!existCategoria) {
        throw new Error(`El id: ${ id }, no corresponde a una categoria existente`)
    }
}

const existeProducto = async(id = '')=>{
    const existProducto = await Producto.findById(id)

    if (!existProducto) {
        throw new Error(`El id: ${ id }, no corresponde a una producto existente`)
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto
}