import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webContainer.js'
import { initializeSocket, sendMessage } from '../config/socket.js'

function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)
            ref.current.removeAttribute('data-highlighted')
        }
    }, [props.className, props.children])

    return <code {...props} ref={ref} />
}

const Project = () => {
    const location = useLocation()
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(new Set())
    const [project, setProject] = useState(location.state.project[0])
    const [message, setMessage] = useState('')
    const { user } = useContext(UserContext)
    const messageBox = React.createRef()

    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [fileTree, setFileTree] = useState({})
    const [currentFile, setCurrentFile] = useState(null)
    const [openFiles, setOpenFiles] = useState([])
    const [webContainer, setWebContainer] = useState(null)
    const [iframeUrl, setIframeUrl] = useState(null)
    const [runProcess, setRunProcess] = useState(null)
    const [isRunning, setIsRunning] = useState(false)
    const [terminalOutput, setTerminalOutput] = useState([])
    const previewRef = useRef(null)
    const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false)

    const handleUserClick = (id) => {
        setSelectedUserId(prev => {
            const newSet = new Set(prev)
            if (newSet.has(id)) newSet.delete(id)
            else newSet.add(id)
            return newSet
        })
    }

    const send = () => {
        if (message.trim() === '') return
        sendMessage('project-message', {
            message,
            sender: user
        })
        setMessage("")
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            send()
        }
    }

    function WriteAiMessage(message) {
        const messageObject = JSON.parse(message)
        return (
            <div className='overflow-auto bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200 rounded-lg p-3 border border-gray-700'>
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>
        )
    }

    // -------------------------
    // WEBCONTAINER INITIALIZATION
    // -------------------------
    useEffect(() => {
        let isMounted = true;

        const initWebContainer = async () => {
            try {
                console.log("Initializing WebContainer...")
                const container = await getWebContainer()
                if (isMounted) {
                    setWebContainer(container)
                    console.log("WebContainer initialized successfully")
                }
            } catch (err) {
                console.error("Failed to initialize WebContainer:", err)
                if (err.message && err.message.includes("Unable to create more instances")) {
                    console.warn("⚠️ WebContainer is already running in another tab or session.")
                } else if (isMounted) {
                    console.log("Retrying WebContainer initialization in 3 seconds...")
                    setTimeout(() => {
                        if (isMounted) {
                            initWebContainer()
                        }
                    }, 3000)
                }
            }
        }

        initWebContainer()

        return () => {
            isMounted = false
        }
    }, [])

    // -------------------------
    // SOCKET LISTENER
    // -------------------------
    useEffect(() => {
        const projectId = location?.state?.project?.[0]?._id;
        const socket = initializeSocket(projectId);

        const handleMessage = (data) => {
            if (data.sender._id === 'ai') {
                try {
                    const parsed = JSON.parse(data.message);
                    if (webContainer && parsed.fileTree && Object.keys(parsed.fileTree).length > 0) {
                        const convertedTree = convertToWebContainerFormat(parsed.fileTree)
                        webContainer.mount(convertedTree);
                    }
                    if (parsed.fileTree) {
                        setFileTree(parsed.fileTree);
                        saveFileTree(parsed.fileTree);
                    }
                } catch (err) {
                    console.error('Error parsing AI message:', err);
                }
                setMessages(prev => [...prev, data]);
                return;
            }
            setMessages(prev => [...prev, data]);
        };

        socket.on("connect", () => {
            console.log("Socket Connected:", socket.id);
            socket.off("project-message");
            socket.on("project-message", handleMessage);
        });

        return () => {
            socket.off("project-message", handleMessage);
            socket.disconnect();
        };
    }, [webContainer]);

    function addCollaborators() {
        axios.put("/projects/add-user", {
            projectId: location.state.project[0]._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            console.log(res.data)
            setIsModalOpen(false)
            setSelectedUserId(new Set())
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        const projectId = location?.state?.project?.[0]?._id;

        if (!projectId) {
            console.error('No project ID found');
            return;
        }

        setFileTree({});
        setCurrentFile(null);
        setOpenFiles([]);
        setIframeUrl(null);

        axios.get(`/projects/get-project/${projectId}`).then(res => {
            setProject(res.data.project)
            if (res.data.project.fileTree && Object.keys(res.data.project.fileTree).length > 0) {
                console.log(`Loading fileTree for project: ${projectId}`);
                setFileTree(res.data.project.fileTree);
                if (webContainer) {
                    webContainer.mount(res.data.project.fileTree);
                    console.log('FileTree mounted to WebContainer');
                }
            } else {
                console.log(`No saved files for project: ${projectId}`);
            }
        }).catch(err => {
            console.error('Failed to load project:', err);
        })

        axios.get('/users/all').then(res => {
            setUsers(res.data.users)
        })
    }, [location?.state?.project?.[0]?._id, webContainer])

    function saveFileTree(ft) {
        if (!project?._id) {
            console.error('Cannot save fileTree: project not loaded yet');
            return;
        }

        axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        }).then(res => {
            console.log('✅ FileTree saved to MongoDB successfully');
        }).catch(err => {
            console.error('❌ Failed to save fileTree:', err);
        })
    }

    function scrollToBottom() {
        if (messageBox.current) {
            messageBox.current.scrollTop = messageBox.current.scrollHeight
        }
    }

    // Convert flat fileTree to WebContainer nested format
    function convertToWebContainerFormat(flatTree) {
        const result = {}
        
        Object.entries(flatTree).forEach(([path, fileObj]) => {
            const parts = path.split('/')
            let current = result
            
            // Navigate/create nested structure for directories
            for (let i = 0; i < parts.length - 1; i++) {
                const dirName = parts[i]
                if (!current[dirName]) {
                    current[dirName] = { directory: {} }
                }
                // Move into the directory object
                current = current[dirName].directory
            }
            
            // Add the file at the correct level
            const fileName = parts[parts.length - 1]
            if (fileObj && fileObj.file && fileObj.file.contents) {
                // Already in correct format { file: { contents: "..." } }
                current[fileName] = fileObj
            } else if (fileObj && fileObj.contents) {
                // Has contents directly, wrap it
                current[fileName] = { file: { contents: fileObj.contents } }
            } else {
                // Unknown format, try as-is
                current[fileName] = fileObj
            }
        })
        
        console.log('Converted fileTree:', result)
        return result
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Track fullscreen state for preview panel
    useEffect(() => {
        const onFullScreenChange = () => {
            const el = previewRef.current
            setIsPreviewFullscreen(Boolean(document.fullscreenElement && document.fullscreenElement === el))
        }
        document.addEventListener('fullscreenchange', onFullScreenChange)
        return () => document.removeEventListener('fullscreenchange', onFullScreenChange)
    }, [])

    const runProject = async () => {
        if (!webContainer) {
            alert('WebContainer is still initializing. Please wait...')
            return
        }
        if (Object.keys(fileTree).length === 0) {
            alert('No files in project. Please add files from AI or upload files first.')
            return
        }
        
        try {
            setIsRunning(true)
            setTerminalOutput(prev => [...prev, '$ npm install && npm run dev', 'Starting installation...'])
            
            console.log('Original fileTree sample:', Object.entries(fileTree).slice(0, 2).map(([k, v]) => [k, v]))
            const convertedTree = convertToWebContainerFormat(fileTree)
            console.log('Converted fileTree sample:', Object.entries(convertedTree).slice(0, 2).map(([k, v]) => [k, v]))
            console.log('Full converted tree:', convertedTree)
            
            await webContainer.mount(convertedTree)
            console.log('Files mounted successfully!')
            setTerminalOutput(prev => [...prev, '✓ Files mounted successfully!'])
            
            console.log('Installing dependencies...')
            setTerminalOutput(prev => [...prev, 'Installing dependencies...'])
            
            const installProcess = await webContainer.spawn("npm", ["install"])
            installProcess.output.pipeTo(new WritableStream({
                write(chunk) {
                    console.log(chunk)
                    setTerminalOutput(prev => [...prev, chunk])
                }
            }))
            
            const installExitCode = await installProcess.exit
            if (installExitCode !== 0) {
                setTerminalOutput(prev => [...prev, '❌ Installation failed!'])
                alert('Installation failed. Check console for details.')
                setIsRunning(false)
                return
            }
            
            setTerminalOutput(prev => [...prev, '✓ Installation complete!'])
            console.log('Installation complete. Starting server...')
            
            if (runProcess) {
                runProcess.kill()
            }
            
            const tempRunProcess = await webContainer.spawn("npm", ["run", "dev"])
            tempRunProcess.output.pipeTo(new WritableStream({
                write(chunk) {
                    console.log(chunk)
                    setTerminalOutput(prev => [...prev, chunk])
                }
            }))
            
            setRunProcess(tempRunProcess)
            webContainer.on('server-ready', (port, url) => {
                console.log(port, url)
                setIframeUrl(url)
                setTerminalOutput(prev => [...prev, `✓ Server running on ${url}`])
            })
            
        } catch (error) {
            console.error('Error running project:', error)
            console.error('Original fileTree:', fileTree)
            setTerminalOutput(prev => [...prev, `❌ Error: ${error.message}`])
            alert(`Failed to run project: ${error.message}. Check console for details.`)
            setIsRunning(false)
        }
    }

    const stopProject = () => {
        if (runProcess) {
            runProcess.kill()
            setRunProcess(null)
            setIsRunning(false)
            setIframeUrl(null)
            setTerminalOutput(prev => [...prev, '✓ Server stopped'])
        }
    }

    const togglePreviewFullscreen = async () => {
        const el = previewRef.current
        if (!el) return
        try {
            if (document.fullscreenElement && document.fullscreenElement === el) {
                await document.exitFullscreen()
            } else {
                // Request fullscreen on the preview container
                if (el.requestFullscreen) await el.requestFullscreen()
                else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
                else if (el.msRequestFullscreen) el.msRequestFullscreen()
            }
        } catch (err) {
            console.error('Fullscreen toggle failed:', err)
        }
    }

    // Safe file icon getter function
    const getFileIcon = (fileName) => {
        if (!fileName || typeof fileName !== 'string') return 'ri-file-text-fill';
        
        if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) return 'ri-file-js-fill';
        if (fileName.endsWith('.html')) return 'ri-file-html-fill';
        if (fileName.endsWith('.css')) return 'ri-file-css-fill';
        if (fileName.endsWith('.json')) return 'ri-file-code-fill';
        if (fileName.endsWith('.md')) return 'ri-markdown-fill';
        if (fileName.endsWith('.txt')) return 'ri-file-text-fill';
        if (fileName.endsWith('.py')) return 'ri-file-code-fill';
        if (fileName.endsWith('.java')) return 'ri-file-code-fill';
        if (fileName.endsWith('.cpp') || fileName.endsWith('.c')) return 'ri-file-code-fill';
        
        return 'ri-file-text-fill';
    }

    const getFileIconColor = (fileName) => {
        if (!fileName || typeof fileName !== 'string') return 'text-yellow-400';
        
        if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) return 'text-yellow-400';
        if (fileName.endsWith('.html')) return 'text-orange-500';
        if (fileName.endsWith('.css')) return 'text-blue-400';
        if (fileName.endsWith('.json')) return 'text-yellow-300';
        if (fileName.endsWith('.md')) return 'text-blue-300';
        if (fileName.endsWith('.txt')) return 'text-gray-400';
        
        return 'text-gray-400';
    }

    return (
        <main className="h-screen w-screen flex bg-gray-900 overflow-hidden">
            {/* Left Panel - Chat */}
            <section className="left relative flex flex-col h-full w-80 min-w-80 bg-gray-800 border-r border-gray-700 shadow-lg">
                <header className="flex justify-between items-center p-4 w-full bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
                    <button
                        className="flex gap-2 items-center hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors text-gray-200"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <i className="ri-user-add-fill text-lg"></i>
                        <p className="font-medium">Add Collaborator</p>
                    </button>
                    <button
                        onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-200"
                    >
                        <i className="ri-group-fill text-xl"></i>
                    </button>
                </header>

                <div className="conversation-area flex flex-col h-full relative bg-gray-800">
                    <div
                        ref={messageBox}
                        className="message-box p-4 flex-grow flex flex-col gap-3 overflow-auto max-h-full scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700"
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`${msg.sender._id === 'ai' ? 'max-w-full' : 'max-w-72'} ${msg.sender._id === user?._id?.toString() && 'ml-auto'} message flex flex-col p-3 bg-gray-700 rounded-xl shadow-sm border border-gray-600`}
                            >
                                <small className="text-gray-400 text-xs font-medium mb-1">
                                    {msg.sender?.email || 'Unknown User'}
                                </small>
                                <div className="text-sm">
                                    {msg.sender._id === 'ai'
                                        ? WriteAiMessage(msg.message)
                                        : <p className="text-gray-200">{msg.message}</p>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="inputField w-full flex p-4 bg-gray-800 border-t border-gray-700">
                        <div className="flex gap-2 w-full bg-gray-700 rounded-xl p-1">
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="p-3 px-4 bg-transparent border-none outline-none flex-grow text-gray-200 placeholder-gray-400"
                                type="text"
                                placeholder="Type a message..."
                            />
                            <button
                                onClick={send}
                                disabled={!message.trim()}
                                className={`px-4 rounded-lg transition-all ${message.trim() ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-600 text-gray-500'} text-white flex items-center gap-2`}
                            >
                                <i className="ri-send-plane-fill"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Side Panel - Collaborators */}
            <div className={`sidePanel w-80 h-full flex flex-col bg-gray-800 border-r border-gray-700 absolute left-80 top-0 transition-all duration-300 z-10 ${isSidePanelOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full opacity-0 pointer-events-none'}`}>
                <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
                    <h1 className="font-semibold text-lg text-gray-200">Collaborators</h1>
                    <button
                        onClick={() => setIsSidePanelOpen(false)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-200"
                    >
                        <i className="ri-close-fill text-xl"></i>
                    </button>
                </header>

                <div className="p-6 border-b border-gray-700">
                    <button
                        onClick={addCollaborators}
                        disabled={selectedUserId.size === 0}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${selectedUserId.size > 0 ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                    >
                        Add {selectedUserId.size > 0 ? `${selectedUserId.size} Collaborator${selectedUserId.size > 1 ? 's' : ''}` : 'Collaborators'}
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-4">
                    <h3 className="font-semibold text-gray-300 mb-3">Current Collaborators</h3>
                    <div className="space-y-2">
                        {project?.users?.map(collab => (
                            <div key={collab._id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-700">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                    {collab?.email?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <span className="text-sm font-medium text-gray-200">{collab?.email || 'Unknown User'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Code Editor */}
            <section className="right flex-grow h-full flex bg-gray-900 min-w-0">
                {/* File Explorer */}
                <div className="explorer h-full w-64 min-w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-700">
                        <h2 className="font-semibold text-gray-200 text-lg">Project Files</h2>
                    </div>
                    <div className="file-tree flex-1 overflow-auto">
                        {Object.keys(fileTree).length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                <i className="ri-folder-open-line text-3xl mb-2"></i>
                                <p className="text-sm">No files yet</p>
                            </div>
                        ) : (
                            Object.keys(fileTree).map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentFile(file)
                                        setOpenFiles(prev => [...new Set([...prev, file])])
                                    }}
                                    className={`tree-element cursor-pointer p-3 px-4 flex items-center gap-3 w-full hover:bg-gray-700 transition-colors ${currentFile === file ? 'bg-gray-700 border-r-2 border-blue-500' : ''}`}
                                >
                                    <i className={`${getFileIcon(file)} ${getFileIconColor(file)}`}></i>
                                    <p className="font-medium text-gray-200 truncate text-sm">
                                        {file || 'Unnamed File'}
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Code Editor Area */}
                <div className="code-editor flex flex-col flex-grow h-full min-w-0">
                    {/* File Tabs */}
                    <div className="top flex justify-between items-center bg-gray-800 border-b border-gray-700">
                        <div className="files flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
                            {openFiles.map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentFile(file)}
                                    className={`open-file cursor-pointer p-3 px-4 flex items-center gap-2 min-w-0 border-r border-gray-700 transition-colors ${currentFile === file ? 'bg-gray-900 text-blue-400 border-b-2 border-blue-500' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                                >
                                    <i className={`${getFileIcon(file)} ${getFileIconColor(file)}`}></i>
                                    <p className="font-medium text-sm truncate max-w-32">
                                        {file || 'Unnamed File'}
                                    </p>
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setOpenFiles(prev => prev.filter(f => f !== file))
                                            if (currentFile === file) {
                                                setCurrentFile(openFiles.filter(f => f !== file)[0] || null)
                                            }
                                        }}
                                        className="ml-2 hover:bg-gray-600 rounded p-1 transition-colors cursor-pointer text-gray-400 hover:text-gray-200"
                                    >
                                        <i className="ri-close-line text-xs"></i>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="actions flex gap-2 p-3">
                            {isRunning ? (
                                <button
                                    onClick={stopProject}
                                    className="px-4 py-2 rounded-lg font-medium transition-all bg-red-600 hover:bg-red-500 text-white flex items-center gap-2"
                                >
                                    <i className="ri-stop-fill"></i>
                                    Stop
                                </button>
                            ) : (
                                <button
                                    onClick={runProject}
                                    disabled={!webContainer}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${webContainer ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                                >
                                    <i className="ri-play-fill"></i>
                                    {webContainer ? 'Run' : 'Initializing...'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Code Editor */}
                    <div className="bottom flex-grow min-h-0 bg-gray-900 flex">
                        {fileTree[currentFile]?.file?.contents && (
                            <div className="code-editor-area h-full flex-1 overflow-auto bg-gray-900">
                                <pre className="hljs h-full m-0">
                                    <code
                                        className="hljs h-full outline-none text-sm font-mono leading-relaxed p-6 text-gray-200"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => {
                                            const updatedContent = e.target.innerText
                                            const ft = {
                                                ...fileTree,
                                                [currentFile]: {
                                                    file: {
                                                        contents: updatedContent
                                                    }
                                                }
                                            }
                                            setFileTree(ft)
                                            saveFileTree(ft)
                                        }}
                                        dangerouslySetInnerHTML={{ __html: hljs.highlight(fileTree[currentFile].file.contents, { language: 'javascript' }).value }}
                                        style={{
                                            whiteSpace: 'pre-wrap',
                                            counterSet: 'line-numbering',
                                            backgroundColor: '#111827',
                                        }}
                                    />
                                </pre>
                            </div>
                        )}
                        {!currentFile && (
                            <div className="h-full flex-1 flex items-center justify-center text-gray-500 bg-gray-900">
                                <div className="text-center">
                                    <i className="ri-file-code-line text-6xl mb-4 text-gray-600"></i>
                                    <p className="text-lg text-gray-400">Select a file to start editing</p>
                                </div>
                            </div>
                        )}

                        {/* Terminal Output */}
                        <div className="terminal w-80 min-w-80 bg-black border-l border-gray-800 flex flex-col">
                            <div className="terminal-header bg-gray-800 text-gray-200 px-4 py-2 border-b border-gray-700">
                                <h3 className="font-semibold text-sm">Terminal</h3>
                            </div>
                            <div className="terminal-output flex-1 overflow-auto p-4 font-mono text-sm text-green-400 bg-gray-900">
                                {terminalOutput.map((line, index) => (
                                    <div key={index} className="mb-1">
                                        {line}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Panel */}
                {iframeUrl && webContainer && (
                    <div className="flex flex-col h-full w-96 min-w-96 bg-gray-800 border-l border-gray-700">
                        <div ref={previewRef} className="flex flex-col h-full w-96 min-w-96 bg-gray-800 border-l border-gray-700">
                            <div className="address-bar bg-gray-700 border-b border-gray-600 p-3 flex items-center gap-2">
                                <div className="flex items-center gap-2 bg-gray-600 rounded-lg px-3 py-2 border border-gray-500 flex-1">
                                    <i className="ri-window-fill text-gray-400"></i>
                                    <input
                                        type="text"
                                        onChange={(e) => setIframeUrl(e.target.value)}
                                        value={iframeUrl}
                                        className="w-full bg-transparent border-none outline-none text-sm text-gray-200"
                                    />
                                </div>
                                <button
                                    onClick={togglePreviewFullscreen}
                                    aria-label={isPreviewFullscreen ? 'Exit fullscreen' : 'Open preview fullscreen'}
                                    className="ml-2 p-2 bg-gray-600 rounded text-gray-200 hover:bg-gray-500"
                                >
                                    <i className={isPreviewFullscreen ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'}></i>
                                </button>
                            </div>
                            <iframe
                                src={iframeUrl}
                                className="w-full h-full bg-white"
                                title="Project Preview"
                            />
                        </div>
                    </div>
                )}
            </section>

            {/* Add Collaborator Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl w-full max-w-md shadow-2xl border border-gray-700">
                        <header className="flex justify-between items-center p-6 border-b border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-200">Add Collaborators</h2>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false)
                                    setSelectedUserId(new Set())
                                }}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
                            >
                                <i className="ri-close-fill text-xl"></i>
                            </button>
                        </header>

                        <div className="users-list flex flex-col gap-2 p-6 max-h-96 overflow-auto">
                            {users.map(user => (
                                <div
                                    key={user._id}
                                    className={`user cursor-pointer p-3 flex gap-3 items-center rounded-lg border transition-all ${Array.from(selectedUserId).includes(user._id) ? 'bg-gray-700 border-blue-500' : 'border-gray-600 hover:bg-gray-700'}`}
                                    onClick={() => handleUserClick(user._id)}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                        {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <h1 className="font-semibold text-gray-200">{user?.email || 'Unknown User'}</h1>
                                    </div>
                                    {Array.from(selectedUserId).includes(user._id) && (
                                        <i className="ri-check-fill text-blue-400 text-lg"></i>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-t border-gray-700">
                            <button
                                onClick={addCollaborators}
                                disabled={selectedUserId.size === 0}
                                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${selectedUserId.size > 0 ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                            >
                                Add {selectedUserId.size > 0 ? `${selectedUserId.size} Collaborator${selectedUserId.size > 1 ? 's' : ''}` : 'Collaborators'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Project