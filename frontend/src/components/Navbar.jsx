import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from 'react-avatar';
import { MdLightMode } from "react-icons/md";
import { BsGridFill } from "react-icons/bs";
import { api_base_url, toggleClass } from '../helper';

const Navbar = ({ isGridLayout, setIsGridLayout }) => {

  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");;

  useEffect(() => {
    fetch(api_base_url + "/getUserDetails", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId")
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        setData(data.user);
      }
      else {
        setError(data.message);
      }
    })
  }, [])

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  }

  return (
    <>
      <div className="navbar flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] h-16 sm:h-20 glass-strong shadow-elevated animate-slideDown" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="logo">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold gradient-text cursor-pointer whitespace-nowrap">TechioLaza</h1>
        </div>
        <div className="links flex items-center gap-2 sm:gap-4 md:gap-6 overflow-x-auto">
          <Link to='/' className="text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition-all hover:scale-105 whitespace-nowrap">Home</Link>
          <Link to='/tutorials' className="text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition-all hover:scale-105 whitespace-nowrap hidden sm:inline">Tutorials</Link>
          <Link to='/problems' className="text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition-all hover:scale-105 whitespace-nowrap hidden sm:inline">Problems</Link>
          <Link to='/qna' className="text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition-all hover:scale-105 whitespace-nowrap hidden sm:inline">Q&A</Link>
          <button onClick={logout} className='btnBlue !bg-gradient-to-r !from-red-500 !to-red-600 min-w-fit px-3 sm:px-4 sm:min-w-[120px] ml-1 sm:ml-2 text-xs sm:text-sm py-2 sm:py-2'>Logout</button>
          <Avatar onClick={() => { toggleClass(".dropDownNavbar", "hidden") }} name={data ? data.name : ""} size="32" round="50%" className='cursor-pointer ml-1 sm:ml-2 transition-transform hover:scale-110 ring-2 ring-purple-500/30 flex-shrink-0' />
        </div>

        <div className='dropDownNavbar hidden absolute right-2 sm:right-4 md:right-8 top-full mt-2 glass-strong shadow-elevated p-4 rounded-xl w-48 animate-slideDown'>
          <div className='py-2 border-b border-white/20 mb-3'>
            <h3 className='text-base font-semibold' style={{ lineHeight: 1 }}>{data ? data.name : ""}</h3>
          </div>
          <i className='flex items-center gap-3 py-2 px-2 mb-1 cursor-pointer rounded-lg hover:bg-white/10 transition-all text-sm font-medium' style={{ fontStyle: "normal" }}><MdLightMode className='text-lg' /> Light mode</i>
          <i onClick={() => setIsGridLayout(!isGridLayout)} className='flex items-center gap-3 py-2 px-2 cursor-pointer rounded-lg hover:bg-white/10 transition-all text-sm font-medium' style={{ fontStyle: "normal" }}><BsGridFill className='text-lg' /> {isGridLayout ? "List" : "Grid"} layout</i>
        </div>
      </div>
    </>
  )
}

export default Navbar
