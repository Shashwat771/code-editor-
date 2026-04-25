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
      <div className='flex items-center justify-between px-[100px] my-12 animate-slideUp'>
        <div>
          <h2 className='text-3xl font-bold mb-1'>Hi, {userData ? userData.username : ""} 👋</h2>
          <p className='text-gray-400 text-sm'>Welcome back to your projects</p>
        </div>
        <div className='flex items-center gap-3'>
          {/* Search Bar */}
          <div className="inputBox !w-[380px] !mb-0">
            <input
              type="text"
              placeholder='Search projects...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={() => { setIsCreateModelShow(true) }} className='btnBlue !rounded-full !w-12 !h-12 !p-0 text-2xl flex items-center justify-center'>+</button>
        </div>
      </div>

      {/* Project Display */}
      <div className="cards px-[100px]">
        {
          isGridLayout ?
            <div className='grid'>
              {
                filteredData.length > 0 ? filteredData.map((item, index) => (
                  <GridCard key={index} item={item} />
                )) : <p className='text-gray-400 text-center w-full py-12'>No projects found</p>
              }
            </div>
            : <div className='list space-y-4'>
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
        <div className="createModelCon fixed top-0 left-0 right-0 bottom-0 w-screen h-screen modal-backdrop flex items-center justify-center animate-fadeIn" style={{ zIndex: 100 }}>
          <div className="createModel w-[28vw] glass-strong shadow-elevated rounded-2xl p-8 animate-scaleIn">
            <h3 className='text-2xl font-semibold mb-6'>Create New Project</h3>
            <div className="inputBox !bg-transparent !mb-6">
              <input
                onChange={(e) => { setProjTitle(e.target.value) }}
                value={projTitle}
                type="text"
                placeholder='Project Title'
              />
            </div>
            <div className='flex items-center gap-3 w-full'>
              <button onClick={createProj} className='btnBlue rounded-xl w-[48%] !py-3'>Create</button>
              <button onClick={() => { setIsCreateModelShow(false) }} className='btnBlue !bg-gray-700 hover:!bg-gray-600 rounded-xl w-[48%] !py-3'>Cancel</button>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default Home;
