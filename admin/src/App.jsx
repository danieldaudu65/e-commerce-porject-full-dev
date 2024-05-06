import React from 'react'
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Addproduct from './Pages/AddProduct/Addproduct'
import Removeproduct from './Pages/RemoveProduct/Removeproduct'
import Allproducts from './Pages/AllProduct/Allproducts'

const App = () => {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route element={<Addproduct />} path='/' />
        <Route element={<Allproducts />} path='/all-product' />
      </Routes>
    </BrowserRouter>
  )
}

export default App