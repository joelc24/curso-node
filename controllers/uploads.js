const { request, response } = require('express');
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL )

const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models')

const cargarArchivo = async(req = request, res = response)=>{

  try {
    const nombre = await subirArchivo( req.files, undefined, 'images' )
    
    res.json({
      nombre
    })
  } catch (error) {
    res.status(400).json({ error })
  }


    
}

const actualizarArchivo = async(req = request, res = response)=>{

  const { id, coleccion } = req.params

  let modelo; 

  switch ( coleccion ) {
    case 'usuarios':
        modelo = await Usuario.findById(id)
        if( !modelo ){
          return res.status(400).json({ msg: `No existe un usuario con el id: ${id}` });
        }
      break;
    case 'productos':
        modelo = await Producto.findById(id)
        if( !modelo ){
          return res.status(400).json({ msg: `No existe un producto con el id: ${id}` });
        }
      break;
    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' });
  }

  //Limpiar imagenes previas
  try {
    
    if( modelo.img ){
      const pathImagen = path.join(  __dirname, '../uploads', coleccion, modelo.img )
      if(fs.existsSync( pathImagen )){
        fs.unlinkSync( pathImagen )
      }
    }

  } catch (error) {
    return res.status(500).json({ msg: 'Error inesperado'})
  }

  const nombre = await subirArchivo( req.files, undefined, coleccion )
  modelo.img = nombre 

  await modelo.save()

  res.json(modelo)

}


const actualizarImagenCloudinary = async(req = request, res = response)=>{

  const { id, coleccion } = req.params

  let modelo; 

  switch ( coleccion ) {
    case 'usuarios':
        modelo = await Usuario.findById(id)
        if( !modelo ){
          return res.status(400).json({ msg: `No existe un usuario con el id: ${id}` });
        }
      break;
    case 'productos':
        modelo = await Producto.findById(id)
        if( !modelo ){
          return res.status(400).json({ msg: `No existe un producto con el id: ${id}` });
        }
      break;
    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' });
  }

  //Limpiar imagenes previas
  try {
    
    if( modelo.img ){
      const nombreArr = modelo.img.split('/')
      const nombre = nombreArr[ nombreArr.length - 1] 
      const [ public_id ] = nombre.split('.')
      cloudinary.uploader.destroy( public_id )
    }

  } catch (error) {
    return res.status(500).json({ msg: 'Error inesperado'})
  }

  const { tempFilePath } = req.files.archivo
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

  modelo.img = secure_url 

  await modelo.save()

  res.json(modelo)

}



const mostrarImagen = async( req = request, res = response)=>{
  const { id, coleccion } = req.params

  let modelo; 

  switch ( coleccion ) {
    case 'usuarios':
        modelo = await Usuario.findById(id)
        if( !modelo ){
          return res.status(400).json({ msg: `No existe un usuario con el id: ${id}` });
        }
      break;
    case 'productos':
        modelo = await Producto.findById(id)
        if( !modelo ){
          return res.status(400).json({ msg: `No existe un producto con el id: ${id}` });
        }
      break;
    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' });
  }

  //Limpiar imagenes previas
  try {
    
    if( modelo.img ){
      const pathImagen = path.join(  __dirname, '../uploads', coleccion, modelo.img )
      if(fs.existsSync( pathImagen )){
        return res.sendFile( pathImagen )
      }
    }

  } catch (error) {
    return res.status(500).json({ msg: 'Error inesperado'})
  }

  const pathFileDefault = path.join(  __dirname, '../assets','no-image.jpg')
  res.sendFile( pathFileDefault )
}

module.exports = {
  cargarArchivo,
  actualizarArchivo,
  mostrarImagen,
  actualizarImagenCloudinary
}