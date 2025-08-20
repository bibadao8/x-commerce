import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import AdminSidebar from './AdminSidebar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSideBar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className='min-h-screen flex flex-col md:flex-row relative'>
      {/* Mobile Topbar */}
      <div className='flex md:hidden p-4 bg-black text-white z-40'>
        <button onClick={toggleSideBar}>
          <FaBars size={25} />
        </button>
        <h1 className='ml-4 text-xl font-semibold'>Admin Dashboard</h1>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={toggleSideBar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`bg-black w-64 min-h-screen text-white fixed md:relative transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 md:translate-x-0 md:static z-40`}
      >
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className='flex-grow p-6 overflow-auto z-10 md:z-auto'>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
