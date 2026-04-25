import React, { useState } from 'react'
import img from "../images/code.png"
import deleteImg from "../images/delete.png"
import { api_base_url } from '../helper';
import { useNavigate } from 'react-router-dom';

const ListCard = ({ item }) => {
  const navigate = useNavigate();
  const [isDeleteModelShow, setIsDeleteModelShow] = useState(false);

  const deleteProj = (id) => {
    fetch(api_base_url + "/deleteProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        progId: id,
        userId: localStorage.getItem("userId")
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        setIsDeleteModelShow(false)
        window.location.reload()
      } else {
        alert(data.message)
        setIsDeleteModelShow(false)
      }
    })
  }
  return (
    <>
      <div className="listCard w-full flex items-center justify-between p-4 sm:p-5 professional-card hover-lift cursor-pointer rounded-xl shadow-professional transition-all hover:shadow-elevated hover:border-cyan-500/30 group border border-purple-500/10">
        <div onClick={() => { navigate(`/editior/${item._id}`) }} className='flex items-center gap-4 min-w-0 flex-1'>
          <div className='p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 group-hover:from-purple-500/30 group-hover:to-cyan-500/30 transition-all flex-shrink-0'>
            <img className='w-6 h-6 opacity-90' src={img} alt="Code" />
          </div>
          <div className='min-w-0 flex-1'>
            <h3 className='text-base sm:text-lg font-semibold line-clamp-1 group-hover:text-cyan-300 transition-colors'>{item.title}</h3>
            <div className='flex items-center gap-2 mt-1'>
              <p className='text-gray-400 text-xs sm:text-sm'>Updated {new Date(item.date).toLocaleDateString()}</p>
              <span className='text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300'>Active</span>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-4'>
          <button onClick={() => { navigate(`/editior/${item._id}`) }} className='text-xs px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-all whitespace-nowrap'>
            Open
          </button>
          <img onClick={() => { setIsDeleteModelShow(true) }} className='w-5 cursor-pointer opacity-50 hover:opacity-100 transition-all' src={deleteImg} alt="Delete" />
        </div>
      </div>

      {
        isDeleteModelShow ? <div className="model fixed top-0 left-0 w-screen h-screen modal-backdrop flex justify-center items-center flex-col animate-fadeIn p-4" style={{ zIndex: 100 }}>
          <div className="mainModel w-full sm:w-96 glass-strong shadow-elevated rounded-2xl p-6 sm:p-8 animate-scaleIn border border-red-500/20">
            <div className='flex items-center gap-4 mb-4'>
              <div className='p-3 rounded-lg bg-red-500/20'>
                <svg className='w-6 h-6 text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                </svg>
              </div>
              <h3 className='text-xl sm:text-2xl font-semibold'>Delete Project?</h3>
            </div>
            <p className='text-gray-400 text-xs sm:text-sm mb-8 ml-16'>This action cannot be undone. All project data will be permanently deleted.</p>
            <div className='flex w-full items-center gap-2 sm:gap-3'>
              <button onClick={() => { deleteProj(item._id) }} className='py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white cursor-pointer flex-1 font-semibold hover:from-red-600 hover:to-red-700 transition-all text-sm sm:text-base'>Delete Project</button>
              <button onClick={() => { setIsDeleteModelShow(false) }} className='py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white cursor-pointer flex-1 font-semibold transition-all text-sm sm:text-base'>Cancel</button>
            </div>
          </div>
        </div> : ""
      }
    </>
  )
}

export default ListCard
