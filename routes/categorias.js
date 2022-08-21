const { Router } = require('express')
const { check } = require('express-validator')
const { crearCategoria, obtenerCategorias, obtenerCategoriaById, actualizarCategoria, borrarCategoria } = require('../controllers/categorias')
const { existeCategoria } = require('../helpers/db-validators')

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares')

const router = Router()

/*
* {{url}}/api/categorias 
*/

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias)

//Obtener catetgoria por id - publico
router.get('/:id', [
    check('id').custom( existeCategoria ),
    validarCampos
], obtenerCategoriaById)


//Crear categoria - privado - cualquier persona con un token valido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es requerido').not().isEmpty(),
    validarCampos 
],crearCategoria)


//Actualizar catetgoria por id - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id','No es un ID valido').isMongoId(),
    check('id').custom( existeCategoria ),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria)

//Borrar catetgoria por id - privado - Admin
router.delete('/:id', [
    validarJWT,
    check('id','No es un ID valido').isMongoId(),
    check('id').custom( existeCategoria ),
    esAdminRole,
    validarCampos
], borrarCategoria)


module.exports = router
 