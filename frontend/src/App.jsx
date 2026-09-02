import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import EnterPage from './pages/enterPage.jsx'
import Navbar from './components/Navbar.jsx'
import './App.css'
import { useEffect } from 'react'
import { checkAuth } from './store/authSlice.js'

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<EnterPage />} />
          {/* Add login/register routes once those page components are created */}
          {/* <Route path="/login" element={<UserLoginPage />} /> */}
          {/* <Route path="/register" element={<UserSignUpPage />} /> */}
        </Routes>
      </main>
    </div>
  )
}

export default App
