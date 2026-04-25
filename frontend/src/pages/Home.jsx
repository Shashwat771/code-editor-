import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import ListCard from '../components/ListCard';
import GridCard from '../components/GridCard';
import { api_base_url } from '../helper';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [projTitle, setProjTitle] = useState("");
  const navigate = useNavigate();
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);

  // Filter data based on search query
  const filteredData = data ? data.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) // Case insensitive filtering
  ) : [];

  const createProj = (e) => {
    if (projTitle === "") {
      alert("Please Enter Project Title");
    } else {
      fetch(api_base_url + "/createProject", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: projTitle,
          userId: localStorage.getItem("userId")
        })
      }).then(res => res.json()).then(data => {
        if (data.success) {
          setIsCreateModelShow(false);
          setProjTitle("");
          alert("Project Created Successfully");
          navigate(`/editior/${data.projectId}`);
        } else {
          alert("Something Went Wrong");
        }
      });
    }
  };

  const getProj = () => {
    fetch(api_base_url + "/getProjects", {
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
        setData(data.projects);
      } else {
        setError(data.message);
      }
    });
  };

  useEffect(() => {
    getProj();
  }, []);


  const [userData, setUserData] = useState(null);
  const [userError, setUserError] = useState("");;

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
        setUserData(data.user);
      }
      else {
        setUserError(data.message);
      }
    })
  }, [])

  const [isGridLayout, setIsGridLayout] = useState(false);


  return (
    <>
      <Navbar isGridLayout={isGridLayout} setIsGridLayout={setIsGridLayout} />
      
      {/* Hero Section */}
      <div className='relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] py-12 sm:py-20 animate-slideUp'>
        {/* Background Gradient Orbs */}
        <div className='absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse'></div>
        <div className='absolute -bottom-8 right-0 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse' style={{ animationDelay: '2s' }}></div>
        
        <div className='relative z-10'>
          <div className='mb-8'>
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight'>
              Welcome back, <span className='gradient-text'>{userData ? userData.username : "Developer"}</span>
            </h1>
            <p className='text-gray-400 text-lg sm:text-xl max-w-2xl'>
              Continue building amazing projects. Your coding environment awaits with powerful tools and unlimited possibilities.
            </p>
          </div>

          {/* Search and Create Section */}
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto'>
            <div className="inputBox !mb-0 flex-1 sm:flex-none sm:!w-80 lg:!w-96">
              <svg className='w-5 h-5 mx-3' fill='none' stroke='currentColor' viewBox='0 0 24 24' opacity='0.5'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
              <input
                type="text"
                placeholder='Search your projects...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button onClick={() => { setIsCreateModelShow(true) }} className='btnBlue !rounded-lg !px-6 sm:!px-8 !py-3 text-base sm:text-lg font-semibold flex items-center justify-center gap-2 whitespace-nowrap'>
              <span>+</span>
              <span>New Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] py-8 sm:py-12'>
        <div className='glass p-6 rounded-lg backdrop-blur-sm'>
          <p className='text-gray-400 text-sm mb-2'>Total Projects</p>
          <h3 className='text-3xl font-bold text-white'>{filteredData.length}</h3>
        </div>
        <div className='glass p-6 rounded-lg backdrop-blur-sm'>
          <p className='text-gray-400 text-sm mb-2'>In Development</p>
          <h3 className='text-3xl font-bold text-white'>{filteredData.length}</h3>
        </div>
        <div className='glass p-6 rounded-lg backdrop-blur-sm'>
          <p className='text-gray-400 text-sm mb-2'>Last Updated</p>
          <h3 className='text-lg font-semibold text-white'>{filteredData.length > 0 ? new Date(filteredData[0].date).toLocaleDateString() : 'N/A'}</h3>
        </div>
      </div>

      {/* Projects Section */}
      <div className='px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] py-12 sm:py-16'>
        <div className='mb-8'>
          <h2 className='text-2xl sm:text-3xl font-bold mb-2'>Your Projects</h2>
          <p className='text-gray-400'>Manage and organize all your coding projects in one place</p>
        </div>

        <div className="cards">
          {
            isGridLayout ?
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
                {
                  filteredData.length > 0 ? filteredData.map((item, index) => (
                    <GridCard key={index} item={item} />
                  )) : <div className='col-span-full flex flex-col items-center justify-center py-16'>
                    <div className='text-6xl mb-4 opacity-20'>📭</div>
                    <p className='text-gray-400 text-lg'>No projects found</p>
                    <p className='text-gray-500 text-sm mt-2'>Create your first project to get started</p>
                  </div>
                }
              </div>
              : <div className='list space-y-3 sm:space-y-4'>
                {
                  filteredData.length > 0 ? filteredData.map((item, index) => (
                    <ListCard key={index} item={item} />
                  )) : <div className='flex flex-col items-center justify-center py-16'>
                    <div className='text-6xl mb-4 opacity-20'>📭</div>
                    <p className='text-gray-400 text-lg'>No projects found</p>
                    <p className='text-gray-500 text-sm mt-2'>Create your first project to get started</p>
                  </div>
                }
              </div>
          }
        </div>
      </div>

      {/* Modal for Creating a New Project */}
      {isCreateModelShow &&
        <div className="createModelCon fixed top-0 left-0 right-0 bottom-0 w-screen h-screen modal-backdrop flex items-center justify-center animate-fadeIn p-4" style={{ zIndex: 100 }}>
          <div className="createModel w-full sm:w-96 glass-strong shadow-elevated rounded-2xl p-6 sm:p-8 animate-scaleIn border border-purple-500/30">
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h3 className='text-2xl sm:text-3xl font-bold'>New Project</h3>
                <p className='text-gray-400 text-sm mt-1'>Create and start coding</p>
              </div>
              <button onClick={() => { setIsCreateModelShow(false) }} className='text-gray-400 hover:text-white transition-colors text-2xl'>×</button>
            </div>
            <div className="inputBox !bg-transparent !mb-6 !border-purple-500/20 hover:!border-purple-500/50">
              <svg className='w-5 h-5 mx-3' fill='none' stroke='currentColor' viewBox='0 0 24 24' opacity='0.5'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
              </svg>
              <input
                onChange={(e) => { setProjTitle(e.target.value) }}
                value={projTitle}
                type="text"
                placeholder='Project name'
                onKeyPress={(e) => e.key === 'Enter' && createProj()}
              />
            </div>
            <div className='flex items-center gap-2 sm:gap-3 w-full'>
              <button onClick={createProj} className='btnBlue rounded-xl flex-1 !py-3 text-sm sm:text-base font-semibold'>Create Project</button>
              <button onClick={() => { setIsCreateModelShow(false) }} className='btnBlue !bg-gray-700 hover:!bg-gray-600 rounded-xl flex-1 !py-3 text-sm sm:text-base font-semibold'>Cancel</button>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default Home;
