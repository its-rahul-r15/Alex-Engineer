import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/user.context.jsx'
import axios from '../config/axios.js'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const { user } = useContext(UserContext)
    const [isModalOpen, setModalOpen] = useState(false)
    const [project, setProject] = useState([])
    const [projectName, setProjectName] = useState('')
    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        console.log(projectName)

        axios.post('/projects/create', {
            name: projectName,
        }).then((res) => {
            console.log(res)
            setModalOpen(false)
            setProjectName('')
            // Refresh projects list
            axios.get('/projects/all').then((res) => {
                setProject(res.data.projects)
            })
        }).catch((err) => { console.log(err) })
    }

    function handleOpen() { setModalOpen(true) }
    function handleClose() {
        setModalOpen(false);
        setProjectName('')
    }

    useEffect(() => {
        axios.get('/projects/all').then((res) => {
            setProject(res.data.projects)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    return (
        <main className='p-6 bg-gray-900 min-h-screen'>
            <div className='max-w-7xl mx-auto'>
                {/* Header */}
                <div className='flex justify-between items-center mb-8'>
                    <div>
                        <h1 className='text-3xl font-bold text-gray-100'>Your Projects</h1>
                        <p className='text-gray-400 mt-2'>Create and manage your coding projects</p>
                    </div>
                    <div className='flex items-center gap-4'>
                        <span className='text-gray-300'>Welcome, {user?.email}</span>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className='projects grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {/* New Project Card */}
                    <button
                        onClick={handleOpen}
                        className='project p-6 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-3 hover:border-blue-500 hover:bg-gray-800 transition-all duration-200 group min-h-[140px]'
                        aria-haspopup="dialog"
                    >
                        <div className='w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center group-hover:bg-blue-500 transition-colors'>
                            <i className="ri-add-line text-2xl text-white"></i>
                        </div>
                        <span className='font-semibold text-gray-200 group-hover:text-white'>New Project</span>
                    </button>

                    {/* Existing Projects */}
                    {project.map((proj) => (
                        <div
                            key={proj._id}
                            onClick={() => navigate(`/project`, {
                                state: { project: [proj] }
                            })}
                            className='project p-6 bg-gray-800 border border-gray-700 rounded-xl cursor-pointer flex flex-col gap-4 hover:border-blue-500 hover:bg-gray-750 transition-all duration-200 group'
                        >
                            <div className='flex items-start justify-between'>
                                <div className='w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center'>
                                    <i className="ri-folder-2-line text-white text-lg"></i>
                                </div>
                                <div className='opacity-0 group-hover:opacity-100 transition-opacity'>
                                    <i className="ri-arrow-right-up-line text-gray-400 text-lg"></i>
                                </div>
                            </div>

                            <div className='flex-grow'>
                                <h3 className='font-semibold text-gray-100 text-lg mb-2 line-clamp-2'>{proj.name}</h3>
                                <div className='flex items-center gap-2 text-sm text-gray-400'>
                                    <i className="ri-user-2-line"></i>
                                    <span>{proj.users?.length || 0} collaborator{proj.users?.length !== 1 ? 's' : ''}</span>
                                </div>
                            </div>

                            <div className='flex items-center justify-between text-xs text-gray-500'>
                                <span>Created {new Date(proj.createdAt).toLocaleDateString()}</span>
                                <div className='flex -space-x-2'>
                                    {/* Safely render user avatars */}
                                    {proj.users?.slice(0, 3).map((user, index) => (
                                        <div
                                            key={user?._id || index}
                                            className='w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs border-2 border-gray-800'
                                            title={user?.email || 'Unknown User'}
                                        >
                                            {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                    ))}
                                    {proj.users && proj.users.length > 3 && (
                                        <div className='w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-gray-300 text-xs border-2 border-gray-800'>
                                            +{proj.users.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {project.length === 0 && (
                    <div className='text-center py-16'>
                        <div className='w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4'>
                            <i className="ri-folder-open-line text-3xl text-gray-400"></i>
                        </div>
                        <h3 className='text-xl font-semibold text-gray-200 mb-2'>No projects yet</h3>
                        <p className='text-gray-400 mb-6'>Create your first project to get started</p>
                        <button
                            onClick={handleOpen}
                            className='px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors'
                        >
                            Create Project
                        </button>
                    </div>
                )}

                {/* Create Project Modal */}
                {isModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                        role="dialog"
                        aria-modal="true"
                        onClick={handleClose}
                    >
                        <div
                            className="bg-gray-800 w-full max-w-md mx-4 rounded-xl shadow-2xl border border-gray-700"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <header className="flex items-center justify-between p-6 border-b border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-100">Create New Project</h2>
                                <button
                                    onClick={handleClose}
                                    className="text-gray-400 hover:text-gray-200 p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                    aria-label="Close modal"
                                >
                                    <i className="ri-close-line text-xl"></i>
                                </button>
                            </header>

                            <form onSubmit={createProject} className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-200">
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        required
                                        className="block w-full rounded-lg bg-gray-700 border border-gray-600 px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g. My Awesome Project"
                                        autoFocus
                                    />
                                    <p className="text-xs text-gray-400">
                                        Give your project a descriptive name
                                    </p>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="px-6 py-3 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors font-medium flex items-center gap-2"
                                    >
                                        <i className="ri-add-line"></i>
                                        Create Project
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}

export default Home