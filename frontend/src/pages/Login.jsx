import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import image from "../images/auth-side.png";
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(api_base_url + "/login", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          password: pwd
        })
      });

      const data = await response.json();

      console.log("Login response:", data); // Debug log

      if (data.success === true) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", data.userId);

        toast.success("Login successful! Redirecting...");

        setTimeout(() => {
          window.location.href = "/"
        }, 500);
      } else {
        setError(data.message || "Login failed. Please try again.");
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
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
            <h2 className="text-2xl font-semibold mb-6">Welcome Back</h2>

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
                placeholder='Password'
                disabled={loading}
                autoComplete="current-password"
                minLength={6}
              />
            </div>

            <p className='text-gray-400 text-sm'>Don't have an account? <Link to="/signUp" className='text-purple-400 hover:text-purple-300 font-medium transition-colors'>Sign Up</Link></p>

            {error && <p className='text-red-400 text-sm my-3 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20'>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btnBlue w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>

            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-400">
                <strong>Test Account:</strong><br />
                Email: test@example.com<br />
                Password: test123
              </p>
            </div>
          </form>
        </div>
        <div className="right w-[55%]">
          <img className='h-[100vh] w-[100%] object-cover' src={image} alt="" />
        </div>
      </div>
    </>
  )
}

export default Login