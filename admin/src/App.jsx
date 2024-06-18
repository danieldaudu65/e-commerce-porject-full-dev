import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Addproduct from './Pages/AddProduct/Addproduct'
import Allproducts from './Pages/AllProduct/Allproducts'
import ViewOrders from './Pages/View-orders/ViewOrders'
import Login from './Pages/Login/Login'
import Home from './Pages/Home/Home'

const App = () => {
  return (
    <BrowserRouter>
    {/* <Navbar /> */}
      <Routes>
        <Route path='/' element = {<Login />} />
        <Route path='/home' element = {<Home />} />

        <Route element={<Addproduct />} path='/add-product' />
        <Route element={<Allproducts />} path='/all-product' />
        <Route element={<ViewOrders />} path='/view-orders' />
      </Routes>
    </BrowserRouter>
  )
}

export default App