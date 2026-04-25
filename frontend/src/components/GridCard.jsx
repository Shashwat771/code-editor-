import React, { useState } from 'react'
import deleteImg from "../images/delete.png"
import codeImg from "../images/code.png"
import { useNavigate } from 'react-router-dom';

const GridCard = ({ item }) => {
  const [isDeleteModelShow, setIsDeleteModelShow] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="gridCard professional-card hover-lift p-5 w-[280px] h-[190px] cursor-pointer rounded-xl shadow-professional transition-all hover:shadow-elevated hover:border-purple-500/50">
        <div onClick={() => { navigate(`/editior/${item._id}`) }}>
          <img className="w-[80px] opacity-80" src={codeImg} alt="" />
          <h3 className='text-lg font-semibold w-[90%] line-clamp-1 mt-2'>{item.title}</h3>
        </div>
        <div className='flex items-center justify-between mt-4'>
          <p className='text-sm text-gray-400'>Created {new Date(item.date).toLocaleDateString()}</p>
          <img onClick={() => { setIsDeleteModelShow(true) }} className='w-[28px] cursor-pointer opacity-70 hover:opacity-100 transition-opacity' src={deleteImg} alt="" />
        </div>
      </div>

      {
        isDeleteModelShow ? <div className="model fixed top-0 left-0 w-screen h-screen modal-backdrop flex justify-center items-center flex-col animate-fadeIn" style={{ zIndex: 100 }}>
          <div className="mainModel w-[28vw] glass-strong shadow-elevated rounded-2xl p-8 animate-scaleIn">
            <h3 className='text-2xl font-semibold mb-6'>Delete Project?</h3>
            <p className='text-gray-400 text-sm mb-8'>This action cannot be undone. Are you sure you want to delete this project?</p>
            <div className='flex w-full items-center gap-3'>
              <button className='py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white cursor-pointer min-w-[48%] font-semibold hover:from-red-600 hover:to-red-700 transition-all'>Delete</button>
              <button onClick={() => { setIsDeleteModelShow(false) }} className='py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white cursor-pointer min-w-[48%] font-semibold transition-all'>Cancel</button>
            </div>
          </div>
        </div> : ""
      }
    </>
  )
}

export default GridCard