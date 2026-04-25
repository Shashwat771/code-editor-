import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from 'react-avatar';
import { api_base_url, toggleClass } from '../helper';

const EditiorNavbar = ({ projectTitle }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

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
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  };

  return (
    <>
      <div className="EditiorNavbar flex items-center justify-between px-[20px] lg:px-[100px] h-[80px] glass-strong shadow-elevated transition-colors duration-300">
        <div className="flex items-center gap-8">
          <div className="logo">
            <Link to="/">
              <h1 className="text-2xl font-bold gradient-text cursor-pointer">TechioLaza</h1>
            </Link>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className='text-gray-400'>File</span>
            <span className='text-gray-600'>/</span>
            <span className='text-gray-200 font-medium'>{projectTitle || "My Project"}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Navigation Links - Show on desktop */}
            {/* Navigation links removed for editor page (Home / Tutorials) */}

          <div className="flex items-center gap-4">
              <Link to='/' className="text-sm font-medium text-gray-300 hover:text-white transition-all hover:scale-105 mr-6">← Back to IDE</Link>
          </div>
        </div>

        {/* dropdown removed (avatar/menu hidden) */}
      </div>
    </>
  )
}

export default EditiorNavbar
