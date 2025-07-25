// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Sidebar from './Components/Sidebar/Sidebar'
import AddProduct from './Components/AddProduct/AddProduct'
import ListProduct from './Components/ListProduct/ListProduct'

const App = () => {
  return (
    <>
      <Navbar />
      <div className="admin">
        <Sidebar />
        <Routes>
          <Route path="/" element={<ListProduct />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/listproduct" element={<ListProduct />} />
        </Routes>
      </div>
    </>
  )
}

export default App
