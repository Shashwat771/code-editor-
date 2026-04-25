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
      <div className="listCard w-full flex items-center justify-between p-5 professional-card hover-lift cursor-pointer rounded-xl shadow-professional transition-all hover:shadow-elevated hover:border-purple-500/50">
        <div onClick={() => { navigate(`/editior/${item._id}`) }} className='flex items-center gap-4'>
          <img className='w-[70px] opacity-80' src={img} alt="" />
          <div>
            <h3 className='text-lg font-semibold'>{item.title}</h3>
            <p className='text-gray-400 text-sm mt-1'>Created {new Date(item.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div>
          <img onClick={() => { setIsDeleteModelShow(true) }} className='w-[28px] cursor-pointer mr-4 opacity-70 hover:opacity-100 transition-opacity' src={deleteImg} alt="" />
        </div>
      </div>

      {
        isDeleteModelShow ? <div className="model fixed top-0 left-0 w-screen h-screen modal-backdrop flex justify-center items-center flex-col animate-fadeIn" style={{ zIndex: 100 }}>
          <div className="mainModel w-[28vw] glass-strong shadow-elevated rounded-2xl p-8 animate-scaleIn">
            <h3 className='text-2xl font-semibold mb-6'>Delete Project?</h3>
            <p className='text-gray-400 text-sm mb-8'>This action cannot be undone. Are you sure you want to delete this project?</p>
            <div className='flex w-full items-center gap-3'>
              <button onClick={() => { deleteProj(item._id) }} className='py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white cursor-pointer min-w-[48%] font-semibold hover:from-red-600 hover:to-red-700 transition-all'>Delete</button>
              <button onClick={() => { setIsDeleteModelShow(false) }} className='py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white cursor-pointer min-w-[48%] font-semibold transition-all'>Cancel</button>
            </div>
          </div>
        </div> : ""
      }
    </>
  )
}

export default ListCard