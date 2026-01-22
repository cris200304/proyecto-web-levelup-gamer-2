import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Ingreso from './pages/Ingreso'
import Registro from './pages/Registro'
import Carrito from './pages/Carrito'
import Productos from './pages/Producto'

export default function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/productos'  element={<Productos/>}/>
      <Route path='/ingreso'  element={<Ingreso/>}/>
      <Route path='/registro'  element={<Registro/>}/>
      <Route path='/carrito'  element={<Carrito/>}/>
      <Route path='*' element={<h1>404 - - Página no encontrada</h1>}/>
    </Routes>
    </>
  )
}

