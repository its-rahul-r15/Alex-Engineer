import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/axios.js'
import { UserContext } from '../context/user.context.jsx'
const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setUser } = useContext(UserContext)

  function handleSubmit(e) {
    e.preventDefault()
    axios.post('/users/register', {
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
          <h1 className="text-3xl font-semibold">Create account</h1>
          <p className="text-sm text-slate-400 mt-1">Start your journey — free and simple</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-xl shadow-lg bg-linear-to-b from-slate-800/60 to-slate-900/40 border border-slate-700">
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
              placeholder="Create password"
            />
          </label>

          <label className="block mt-4">
            <span className="text-sm text-slate-300">Confirm password</span>
            <input
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              type="password"
              className="mt-1 block w-full rounded-md bg-slate-800/70 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
              placeholder="Repeat password"
            />
          </label>

          <div className="mt-6">
            <button type="submit" className="w-full py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-medium">Create account</button>
          </div>
        </form>

        <p className="text-center text-sm text-slate-400">Already have an account? <Link to="/login" className="text-sky-400 hover:underline">Sign in</Link></p>
      </div>
    </div>
  )
}

export default Register
