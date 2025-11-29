import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/axios.js'
import { UserContext } from '../context/user.context.jsx'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const { setUser } = useContext(UserContext)

  function submitHandler(e) {
    e.preventDefault();
    axios.post('/users/login', {
      email,
      password
    }).then((res) => {
      console.log(res.data)
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      navigate('/home')
    }).catch((err) => {
      console.log(err.response.data)
    })
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to continue to your account</p>
        </div>

        <form onSubmit={submitHandler} className="p-8 rounded-xl shadow-lg bg-linear-to-b from-slate-800/60 to-slate-900/40 border border-slate-700">
          {error && <div className="text-sm text-red-400 mb-4">{error}</div>}

          <label className="block">
            <span className="text-sm text-slate-300">Email</span>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              className="mt-1 block w-full rounded-md bg-slate-800/70 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
              placeholder="you@example.com"
            />
          </label>

          <label className="block mt-4">
            <span className="text-sm text-slate-300">Password</span>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              className="mt-1 block w-full rounded-md bg-slate-800/70 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
              placeholder="Your password"
            />
          </label>

          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center text-sm text-slate-300">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <Link to="/register" className="text-sm text-sky-400 hover:underline">Don't have an account?</Link>
          </div>

          <button type="submit" className="mt-6 w-full py-2 rounded-md bg-sky-500 hover:bg-sky-600 text-white font-medium">Sign in</button>
        </form>

        <p className="text-center text-sm text-slate-400">Or continue as a guest — <button onClick={() => navigate('/')} className="text-sky-400 hover:underline">Go home</button></p>
      </div>
    </div>
  )
}

export default Login