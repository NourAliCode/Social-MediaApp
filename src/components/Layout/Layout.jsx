import React from 'react'
import NavbarApp from '../Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'

export default function Layout() {
  return (
    <>
    <NavbarApp  />
    <div className='container w-[80%] mx-auto min-h-screen'>
        <Outlet />
    </div>
    <Footer />
    </>
  )
}
