import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import image from "../images/auth-side.png";
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (pwd.length < 6) {
      setError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      toast.error("Username must be at least 3 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(api_base_url + "/signUp", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username.trim(),
          name: name.trim(),
          email: email.trim(),
          password: pwd
        })
      });

      const data = await response.json();

      console.log("SignUp response:", data); // Debug log

      if (data.success === true) {
        toast.success("Account created successfully! Please login.");
        setTimeout(() => {
          navigate("/login");
        }, 500);
      } else {
        setError(data.message || "Sign up failed. Please try again.");
        toast.error(data.message || "Sign up failed");
      }
    } catch (error) {
      console.error("SignUp error:", error);
      setError("Network error. Please check your connection.");
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="container w-screen min-h-screen flex items-center justify-between pl-[100px] animate-fadeIn">
        <div className="left w-[35%] animate-slideUp">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">TechioLaza</h1>
            <p className="text-gray-400 text-sm">Professional Code IDE for Students</p>
          </div>
          <form onSubmit={submitForm} className='w-full mt-8 glass p-8 rounded-2xl shadow-elevated'>
            <h2 className="text-2xl font-semibold mb-6">Create Account</h2>

            <div className="inputBox">
              <input
                required
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                value={username}
                type="text"
                placeholder='Username'
                disabled={loading}
                minLength={3}
                autoComplete="username"
              />
            </div>

            <div className="inputBox">
              <input
                required
                onChange={(e) => { setName(e.target.value); setError(""); }}
                value={name}
                type="text"
                placeholder='Full Name'
                disabled={loading}
                autoComplete="name"
              />
            </div>

            <div className="inputBox">
              <input
                required
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                value={email}
                type="email"
                placeholder='Email Address'
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="inputBox">
              <input
                required
                onChange={(e) => { setPwd(e.target.value); setError(""); }}
                value={pwd}
                type="password"
                placeholder='Password (min 6 characters)'
                disabled={loading}
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <p className='text-gray-400 text-sm'>Already have an account? <Link to="/login" className='text-purple-400 hover:text-purple-300 font-medium transition-colors'>Login</Link></p>

            {error && <p className='text-red-400 text-sm my-3 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20'>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btnBlue w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        </div>
        <div className="right w-[55%]">
          <img className='h-[100vh] w-[100%] object-cover' src={image} alt="" />
        </div>
      </div>
    </>
  )
}

export default SignUp