import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css"
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Editior from './pages/Editior';
import Tutorials from './pages/Tutorials';
import QnA from './pages/QnA';
import AskQuestion from './pages/AskQuestion';
import QuestionDetail from './pages/QuestionDetail';
import Problems from './pages/Problems';

const App = () => {
  let isLoggedIn = localStorage.getItem("isLoggedIn");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path='/tutorials' element={isLoggedIn ? <Tutorials /> : <Navigate to="/login" />} />
          <Route path='/qna' element={isLoggedIn ? <QnA /> : <Navigate to="/login" />} />
          <Route path='/qna/ask' element={isLoggedIn ? <AskQuestion /> : <Navigate to="/login" />} />
          <Route path='/qna/:questionId' element={isLoggedIn ? <QuestionDetail /> : <Navigate to="/login" />} />
          <Route path="/qna/edit/:questionId" element={isLoggedIn ? <AskQuestion /> : <Navigate to="/login" />} />
          <Route path='/problems' element={isLoggedIn ? <Problems /> : <Navigate to="/login" />} />
          <Route path='/problems/:problemId' element={isLoggedIn ? <Problems /> : <Navigate to="/login" />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/editior/:projectID' element={isLoggedIn ? <Editior /> : <Navigate to="/login" />} />
          <Route path="*" element={isLoggedIn ? <NoPage /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App