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
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] my-6 sm:my-12 gap-4 animate-slideUp'>
        <div>
          <h2 className='text-2xl sm:text-3xl font-bold mb-1'>Hi, {userData ? userData.username : ""} 👋</h2>
          <p className='text-gray-400 text-xs sm:text-sm'>Welcome back to your projects</p>
        </div>
        <div className='flex items-center gap-2 sm:gap-3 w-full sm:w-auto'>
          {/* Search Bar */}
          <div className="inputBox !mb-0 flex-1 sm:flex-none sm:!w-72 lg:!w-96">
            <input
              type="text"
              placeholder='Search projects...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={() => { setIsCreateModelShow(true) }} className='btnBlue !rounded-full !w-10 sm:!w-12 !h-10 sm:!h-12 !p-0 text-xl sm:text-2xl flex items-center justify-center flex-shrink-0'>+</button>
        </div>
      </div>

      {/* Project Display */}
      <div className="cards px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px]">
        {
          isGridLayout ?
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
              {
                filteredData.length > 0 ? filteredData.map((item, index) => (
                  <GridCard key={index} item={item} />
                )) : <p className='text-gray-400 text-center w-full py-12 col-span-full'>No projects found</p>
              }
            </div>
            : <div className='list space-y-3 sm:space-y-4'>
              {
                filteredData.length > 0 ? filteredData.map((item, index) => (
                  <ListCard key={index} item={item} />
                )) : <p className='text-gray-400 text-center py-12'>No projects found</p>
              }
            </div>
        }
      </div>

      {/* Modal for Creating a New Project */}
      {isCreateModelShow &&
        <div className="createModelCon fixed top-0 left-0 right-0 bottom-0 w-screen h-screen modal-backdrop flex items-center justify-center animate-fadeIn p-4" style={{ zIndex: 100 }}>
          <div className="createModel w-full sm:w-96 glass-strong shadow-elevated rounded-2xl p-6 sm:p-8 animate-scaleIn">
            <h3 className='text-xl sm:text-2xl font-semibold mb-6'>Create New Project</h3>
            <div className="inputBox !bg-transparent !mb-6">
              <input
                onChange={(e) => { setProjTitle(e.target.value) }}
                value={projTitle}
                type="text"
                placeholder='Project Title'
              />
            </div>
            <div className='flex items-center gap-2 sm:gap-3 w-full'>
              <button onClick={createProj} className='btnBlue rounded-xl flex-1 !py-3 text-sm sm:text-base'>Create</button>
              <button onClick={() => { setIsCreateModelShow(false) }} className='btnBlue !bg-gray-700 hover:!bg-gray-600 rounded-xl flex-1 !py-3 text-sm sm:text-base'>Cancel</button>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default Home;
