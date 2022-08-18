
const { Router } = require('express')
const { check } = require('express-validator')

const { 
    tieneRole, 
    validarJWT, 
    validarCampos, 
    esAdminRole 
} = require('../middlewares')

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators')
const { 
    usuariosGet, 
    usuariosPost, 
    usuariospatch, 
    usuariosDelete, 
    usuariosPut 
} = require('../controllers/usuarios')


const router = Router()

router.get('/', usuariosGet )

router.put('/:id',  [
    check('id','No es un ID valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ),
    validarCampos
],usuariosPut)
router.post('/', [
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('correo','El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    check('password','El password debe de ser de mas de 6 caracteres').isLength({ mi: 6 }),
    //check('rol','El rol no es valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPost)
router.delete('/:id',  [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id','No es un ID valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],usuariosDelete)
router.patch('/',  usuariospatch)


module.exports = router