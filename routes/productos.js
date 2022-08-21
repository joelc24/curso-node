const { Router } = require('express')
const { check } = require('express-validator')

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares')
const { existeProducto, existeCategoria } = require('../helpers/db-validators')

const { 
    obtenerProductos,
    obtenerProducto,
    crearProducto, 
    actualizarProducto, 
    borrarProducto 
} = require('../controllers/productos')

const router = Router()

//*Obtener productos
router.get('/', obtenerProductos)

//*Obtener producto
router.get('id',[
    check('id','El id es obligatorio').not().isEmpty(),
    check('id','No es un ID valido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], obtenerProducto)

//*Crear productos
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id valido').isMongoId(),
    check('categoria').custom( existeCategoria ),
    validarCampos
], crearProducto)

//*Actualizar productos
router.put('/:id', [
    validarJWT,
    check('id','No es un ID valido').isMongoId(),
    check('id').custom( existeProducto),
    validarCampos
], actualizarProducto)


//*Borrar productos
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id','No es un ID valido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], borrarProducto)

module.exports = router