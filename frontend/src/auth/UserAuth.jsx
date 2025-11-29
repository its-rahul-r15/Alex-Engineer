import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'

const UserAuth = ({ children }) => {

    const { user, loading } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        // Only redirect if loading is complete and there's no user
        if (!loading && !user) {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
            }
        }
    }, [user, loading, navigate])

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        )
    }

    // If no user after loading, don't render children (will redirect)
    if (!user) {
        return null;
    }

    return (
        <>
            {children}</>
    )
}

export default UserAuth