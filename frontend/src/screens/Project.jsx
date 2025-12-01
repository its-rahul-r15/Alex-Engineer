import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
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

// File Content Display Component
const FileContentDisplay = ({ fileTree, currentFile, onContentUpdate }) => {
    const [content, setContent] = useState('')
    const textareaRef = useRef(null)
    const preRef = useRef(null)

    // Get file content in consistent way
    const getFileContent = () => {
        if (!fileTree || !currentFile || !fileTree[currentFile]) return ''

        const fileData = fileTree[currentFile]

        // Handle different file formats
        if (fileData.file && fileData.file.contents) {
            return fileData.file.contents
        } else if (fileData.contents) {
            return fileData.contents
        } else if (typeof fileData === 'string') {
            return fileData
        }

        return ''
    }

    // Detect language for syntax highlighting
    const detectLanguage = (fileName) => {
        if (!fileName) return 'plaintext'

        const ext = fileName.split('.').pop()?.toLowerCase()
        const languageMap = {
            'js': 'javascript',
            'jsx': 'javascript',
            'ts': 'typescript',
            'tsx': 'typescript',
            'html': 'html',
            'css': 'css',
            'json': 'json',
            'md': 'markdown',
            'py': 'python',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'php': 'php',
            'rb': 'ruby',
            'xml': 'xml',
            'yaml': 'yaml',
            'yml': 'yaml'
        }

        return languageMap[ext] || 'plaintext'
    }

    // Apply syntax highlighting
    const applySyntaxHighlighting = (content, language) => {
        try {
            if (language === 'plaintext') {
                return hljs.highlightAuto(content).value
            }
            return hljs.highlight(content, { language }).value
        } catch (error) {
            console.warn('Syntax highlighting failed:', error)
            return hljs.highlightAuto(content).value
        }
    }

    useEffect(() => {
        const fileContent = getFileContent()
        setContent(fileContent)

        // Apply syntax highlighting after content is set
        if (preRef.current && fileContent) {
            const language = detectLanguage(currentFile)
            preRef.current.innerHTML = applySyntaxHighlighting(fileContent, language)
        }
    }, [currentFile, fileTree])

    const handleContentChange = (e) => {
        const newContent = e.target.value
        setContent(newContent)

        if (onContentUpdate) {
            onContentUpdate(newContent)
        }
    }

    const handleKeyDown = (e) => {
        // Tab key support
        if (e.key === 'Tab') {
            e.preventDefault()
            const start = e.target.selectionStart
            const end = e.target.selectionEnd

            // Insert tab character
            const newContent = content.substring(0, start) + '  ' + content.substring(end)
            setContent(newContent)

            // Set cursor position after tab
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 2
            }, 0)

            if (onContentUpdate) {
                onContentUpdate(newContent)
            }
        }
    }

    if (!currentFile || !fileTree[currentFile]) {
        return (
            <div className="h-full flex-1 flex items-center justify-center text-gray-500 bg-gray-900">
                <div className="text-center">
                    <i className="ri-file-code-line text-6xl mb-4 text-gray-600"></i>
                    <p className="text-lg text-gray-400">Select a file to start editing</p>
                </div>
            </div>
        )
    }

    const language = detectLanguage(currentFile)
    const isEditable = !['png', 'jpg', 'jpeg', 'gif', 'svg', 'ico'].includes(currentFile.split('.').pop()?.toLowerCase())

    // Safe file icon getter function
    const getFileIcon = (fileName) => {
        if (!fileName || typeof fileName !== 'string') return 'ri-file-text-fill';

        const ext = fileName.split('.').pop()?.toLowerCase()
        const iconMap = {
            'js': 'ri-file-js-fill',
            'jsx': 'ri-file-js-fill',
            'ts': 'ri-file-code-fill',
            'tsx': 'ri-file-code-fill',
            'html': 'ri-file-html-fill',
            'css': 'ri-file-css-fill',
            'json': 'ri-file-code-fill',
            'md': 'ri-markdown-fill',
            'txt': 'ri-file-text-fill',
            'py': 'ri-file-code-fill',
            'java': 'ri-file-code-fill',
            'cpp': 'ri-file-code-fill',
            'c': 'ri-file-code-fill',
            'php': 'ri-file-code-fill',
            'rb': 'ri-file-code-fill',
            'xml': 'ri-file-code-fill',
            'yaml': 'ri-file-code-fill',
            'yml': 'ri-file-code-fill',
            'png': 'ri-image-fill',
            'jpg': 'ri-image-fill',
            'jpeg': 'ri-image-fill',
            'gif': 'ri-image-fill',
            'svg': 'ri-image-fill',
            'ico': 'ri-image-fill'
        }

        return iconMap[ext] || 'ri-file-text-fill'
    }

    const getFileIconColor = (fileName) => {
        if (!fileName || typeof fileName !== 'string') return 'text-gray-400';

        const ext = fileName.split('.').pop()?.toLowerCase()
        const colorMap = {
            'js': 'text-yellow-400',
            'jsx': 'text-yellow-400',
            'ts': 'text-blue-400',
            'tsx': 'text-blue-400',
            'html': 'text-orange-500',
            'css': 'text-blue-400',
            'json': 'text-yellow-300',
            'md': 'text-blue-300',
            'py': 'text-green-400',
            'java': 'text-red-400',
            'cpp': 'text-pink-400',
            'c': 'text-pink-400',
            'php': 'text-purple-400',
            'png': 'text-green-300',
            'jpg': 'text-green-300',
            'jpeg': 'text-green-300',
            'gif': 'text-green-300',
            'svg': 'text-orange-300'
        }

        return colorMap[ext] || 'text-gray-400'
    }

    return (
        <div className="code-editor-area h-full flex-1 overflow-hidden bg-gray-900 flex flex-col">
            {/* File Header */}
            <div className="file-header bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <i className={`${getFileIcon(currentFile)} ${getFileIconColor(currentFile)} text-lg`}></i>
                    <span className="text-gray-200 font-medium text-sm">{currentFile}</span>
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-400 uppercase">
                        {language}
                    </span>
                </div>
                <div className="text-xs text-gray-500">
                    {content.length} characters
                </div>
            </div>

            {/* Code Editor */}
            <div className="editor-container flex-1 overflow-auto relative">
                {isEditable ? (
                    // Editable files - Use textarea for better editing
                    <div className="h-full relative">
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={handleContentChange}
                            onKeyDown={handleKeyDown}
                            className="w-full h-full bg-gray-900 text-gray-200 font-mono text-sm p-6 outline-none resize-none border-none absolute inset-0"
                            style={{
                                lineHeight: '1.5',
                                tabSize: 2
                            }}
                            spellCheck="false"
                        />

                        {/* Syntax highlighted overlay for display only */}
                        <pre
                            ref={preRef}
                            className="h-full p-6 pointer-events-none overflow-auto bg-transparent font-mono text-sm leading-relaxed"
                            style={{
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word'
                            }}
                        />
                    </div>
                ) : (
                    // Non-editable files (images, etc.)
                    <div className="h-full flex items-center justify-center p-8">
                        <div className="text-center text-gray-500">
                            <i className="ri-file-warning-line text-4xl mb-4"></i>
                            <p>This file type cannot be edited in the text editor</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const Project = () => {
    const location = useLocation()
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(new Set())
    const [project, setProject] = useState(location.state?.project?.[0] || {})
    const [message, setMessage] = useState('')
    const { user } = useContext(UserContext)
    const messageBox = useRef(null)

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
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false)
    const [isDeploying, setIsDeploying] = useState(false)
    const [deploymentUrl, setDeploymentUrl] = useState('')
    const [deploymentStatus, setDeploymentStatus] = useState('')
    const [deploymentId, setDeploymentId] = useState(null)

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

    const handleDeploy = async () => {
        if (!project?._id || Object.keys(fileTree).length === 0) {
            alert('No files to deploy. Please add files to your project first.')
            return
        }

        try {
            setIsDeploying(true)
            setDeploymentStatus('Preparing deployment...')
            setIsDeployModalOpen(true)

            const response = await axios.post('/deploy/start', {
                projectId: project._id,
                projectName: project.name || 'my-project'
            })

            if (response.data.success) {
                setDeploymentId(response.data.deployment._id)
                setDeploymentUrl(response.data.deployment.deploymentUrl)
                setDeploymentStatus('Deploying to Vercel...')

                // Start polling for deployment status
                checkDeploymentStatus(response.data.deployment._id)
            }
        } catch (error) {
            console.error('Deployment error:', error)
            setDeploymentStatus(`Error: ${error.response?.data?.error || error.message}`)
            setIsDeploying(false)
        }
    }


    const checkDeploymentStatus = async (deplId) => {
        try {
            const response = await axios.get(`/deploy/status/${deplId}`)
            const deployment = response.data.deployment

            setDeploymentStatus(deployment.status)

            if (deployment.status === 'ready') {
                setIsDeploying(false)
                setDeploymentUrl(deployment.deploymentUrl)
                setDeploymentStatus('Deployment successful! 🎉')
            } else if (deployment.status === 'error') {
                setIsDeploying(false)
                setDeploymentStatus(`Deployment failed: ${deployment.errorMessage || 'Unknown error'}`)
            } else if (deployment.status === 'deploying') {
                // Poll again after 3 seconds
                setTimeout(() => checkDeploymentStatus(deplId), 3000)
            }
        } catch (error) {
            console.error('Error checking deployment status:', error)
            setIsDeploying(false)
            setDeploymentStatus('Error checking deployment status')
        }
    }


    function WriteAiMessage(message) {
        try {
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
        } catch (err) {
            return (
                <div className='overflow-auto bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200 rounded-lg p-3 border border-gray-700'>
                    <p>{message}</p>
                </div>
            )
        }
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
        if (!projectId) return;

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
    }, [webContainer, location?.state?.project?.[0]?._id]);

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

        const ext = fileName.split('.').pop()?.toLowerCase()
        const iconMap = {
            'js': 'ri-file-js-fill',
            'jsx': 'ri-file-js-fill',
            'ts': 'ri-file-code-fill',
            'tsx': 'ri-file-code-fill',
            'html': 'ri-file-html-fill',
            'css': 'ri-file-css-fill',
            'json': 'ri-file-code-fill',
            'md': 'ri-markdown-fill',
            'txt': 'ri-file-text-fill',
            'py': 'ri-file-code-fill',
            'java': 'ri-file-code-fill',
            'cpp': 'ri-file-code-fill',
            'c': 'ri-file-code-fill',
            'php': 'ri-file-code-fill',
            'rb': 'ri-file-code-fill',
            'xml': 'ri-file-code-fill',
            'yaml': 'ri-file-code-fill',
            'yml': 'ri-file-code-fill',
            'png': 'ri-image-fill',
            'jpg': 'ri-image-fill',
            'jpeg': 'ri-image-fill',
            'gif': 'ri-image-fill',
            'svg': 'ri-image-fill',
            'ico': 'ri-image-fill'
        }

        return iconMap[ext] || 'ri-file-text-fill'
    }

    const getFileIconColor = (fileName) => {
        if (!fileName || typeof fileName !== 'string') return 'text-gray-400';

        const ext = fileName.split('.').pop()?.toLowerCase()
        const colorMap = {
            'js': 'text-yellow-400',
            'jsx': 'text-yellow-400',
            'ts': 'text-blue-400',
            'tsx': 'text-blue-400',
            'html': 'text-orange-500',
            'css': 'text-blue-400',
            'json': 'text-yellow-300',
            'md': 'text-blue-300',
            'py': 'text-green-400',
            'java': 'text-red-400',
            'cpp': 'text-pink-400',
            'c': 'text-pink-400',
            'php': 'text-purple-400',
            'png': 'text-green-300',
            'jpg': 'text-green-300',
            'jpeg': 'text-green-300',
            'gif': 'text-green-300',
            'svg': 'text-orange-300'
        }

        return colorMap[ext] || 'text-gray-400'
    }

    // Handle content update from FileContentDisplay
    const handleContentUpdate = (newContent) => {
        if (currentFile) {
            const updatedFileTree = {
                ...fileTree,
                [currentFile]: {
                    file: {
                        contents: newContent
                    }
                }
            }
            setFileTree(updatedFileTree)
            saveFileTree(updatedFileTree)
        }
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
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-200 text-lg">Project Files</h2>
                        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                            {Object.keys(fileTree).length} files
                        </span>
                    </div>
                    <div className="file-tree flex-1 overflow-auto">
                        {Object.keys(fileTree).length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                <i className="ri-folder-open-line text-3xl mb-2"></i>
                                <p className="text-sm">No files yet</p>
                            </div>
                        ) : (
                            <div className="py-2">
                                {Object.keys(fileTree).map((file, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setCurrentFile(file)
                                            if (!openFiles.includes(file)) {
                                                setOpenFiles(prev => [...prev, file])
                                            }
                                        }}
                                        className={`tree-element cursor-pointer p-3 px-4 flex items-center gap-3 w-full hover:bg-gray-700 transition-colors ${currentFile === file ? 'bg-gray-700 border-r-2 border-blue-500' : ''}`}
                                    >
                                        <i className={`${getFileIcon(file)} ${getFileIconColor(file)}`}></i>
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="font-medium text-gray-200 truncate text-sm">
                                                {file.split('/').pop() || 'Unnamed File'}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {file}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
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
                                        {file.split('/').pop() || 'Unnamed File'}
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

                            {/* ADD THIS DEPLOY BUTTON */}
                            <button
                                onClick={handleDeploy}
                                disabled={isDeploying || Object.keys(fileTree).length === 0}
                                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${!isDeploying && Object.keys(fileTree).length > 0 ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                            >
                                <i className={isDeploying ? "ri-loader-4-line animate-spin" : "ri-rocket-2-fill"}></i>
                                {isDeploying ? 'Deploying...' : 'Deploy'}
                            </button>
                        </div>
                    </div>

                    {/* Code Editor */}
                    <div className="bottom flex-grow min-h-0 bg-gray-900 flex">
                        <FileContentDisplay
                            fileTree={fileTree}
                            currentFile={currentFile}
                            onContentUpdate={handleContentUpdate}
                        />

                        {/* Terminal Output */}
                        <div className="terminal w-80 min-w-80 bg-black border-l border-gray-800 flex flex-col">
                            <div className="terminal-header bg-gray-800 text-gray-200 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                                <h3 className="font-semibold text-sm">Terminal</h3>
                                <button
                                    onClick={() => setTerminalOutput([])}
                                    className="text-xs text-gray-400 hover:text-gray-200"
                                >
                                    Clear
                                </button>
                            </div>
                            <div className="terminal-output flex-1 overflow-auto p-4 font-mono text-sm text-green-400 bg-gray-900">
                                {terminalOutput.map((line, index) => (
                                    <div key={index} className="mb-1 whitespace-pre-wrap">
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
            {isDeployModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl w-full max-w-md shadow-2xl border border-gray-700">
                        <header className="flex justify-between items-center p-6 border-b border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                                <i className="ri-rocket-2-fill text-blue-400"></i>
                                Deploying to Vercel
                            </h2>
                            <button
                                onClick={() => {
                                    if (!isDeploying) {
                                        setIsDeployModalOpen(false)
                                        setDeploymentStatus('')
                                    }
                                }}
                                disabled={isDeploying}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-gray-200 disabled:opacity-50"
                            >
                                <i className="ri-close-fill text-xl"></i>
                            </button>
                        </header>

                        <div className="p-6">
                            <div className="mb-4">
                                <p className="text-gray-300 text-sm mb-2">Status:</p>
                                <div className="bg-gray-900 rounded-lg p-4 flex items-center gap-3">
                                    {isDeploying && (
                                        <i className="ri-loader-4-line animate-spin text-blue-400 text-xl"></i>
                                    )}
                                    <p className="text-gray-200">{deploymentStatus || 'Initializing...'}</p>
                                </div>
                            </div>

                            {deploymentUrl && !isDeploying && (
                                <div>
                                    <p className="text-gray-300 text-sm mb-2">Deployment URL:</p>
                                    <div className="bg-gray-900 rounded-lg p-4">
                                        <a
                                            href={deploymentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 break-all flex items-center gap-2"
                                        >
                                            {deploymentUrl}
                                            <i className="ri-external-link-line"></i>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-700">
                            <button
                                onClick={() => {
                                    setIsDeployModalOpen(false)
                                    setDeploymentStatus('')
                                    setDeploymentUrl('')
                                }}
                                disabled={isDeploying}
                                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${!isDeploying ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                            >
                                {isDeploying ? 'Deploying...' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
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