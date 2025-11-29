import React from 'react'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 container mx-auto px-6 py-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <i className="ri-code-box-line text-2xl"></i>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            CodeCollab
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2 rounded-lg hover:bg-white/10 transition-all font-medium"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all font-medium"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 container mx-auto px-6 pt-20 pb-32">
                <div className="text-center max-w-5xl mx-auto">
                    <div className="inline-block mb-6">
                        <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm font-medium backdrop-blur-sm">
                            ✨ AI-Powered Collaborative Coding
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                        Build Projects
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Together with AI
                        </span>
                    </h1>

                    <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Create, collaborate, and deploy full-stack applications with the power of AI.
                        Real-time collaboration meets intelligent code generation.
                    </p>

                    <div className="flex gap-4 justify-center flex-wrap">
                        <button
                            onClick={() => navigate('/home')}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all font-semibold text-lg flex items-center gap-2 group"
                        >
                            Start Building Free
                            <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all font-semibold text-lg flex items-center gap-2"
                        >
                            <i className="ri-play-circle-line"></i>
                            Watch Demo
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                10K+
                            </div>
                            <div className="text-gray-400 mt-2">Projects Created</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                50K+
                            </div>
                            <div className="text-gray-400 mt-2">Developers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
                                99.9%
                            </div>
                            <div className="text-gray-400 mt-2">Uptime</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 container mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Everything You Need to
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Build Faster</span>
                    </h2>
                    <p className="text-gray-400 text-lg">Powerful features that make development a breeze</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Feature 1 */}
                    <div className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/50 transition-all">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <i className="ri-sparkling-2-line text-2xl"></i>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">AI Code Generation</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Generate complete applications with natural language. Just describe what you want to build.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/50 transition-all">
                        <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <i className="ri-team-line text-2xl"></i>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Real-time Collaboration</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Work together with your team in real-time. See changes instantly as they happen.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/50 transition-all">
                        <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <i className="ri-rocket-line text-2xl"></i>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Instant Deploy</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Deploy your projects with one click. No configuration needed.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/50 transition-all">
                        <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <i className="ri-code-s-slash-line text-2xl"></i>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Live Preview</h3>
                        <p className="text-gray-400 leading-relaxed">
                            See your changes in real-time with our integrated preview window.
                        </p>
                    </div>

                    {/* Feature 5 */}
                    <div className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/50 transition-all">
                        <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <i className="ri-database-2-line text-2xl"></i>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Cloud Storage</h3>
                        <p className="text-gray-400 leading-relaxed">
                            All your projects are automatically saved and synced across devices.
                        </p>
                    </div>

                    {/* Feature 6 */}
                    <div className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/50 transition-all">
                        <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <i className="ri-terminal-box-line text-2xl"></i>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Built-in Terminal</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Full terminal access with npm, git, and all your favorite tools.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 container mx-auto px-6 py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to Build Something Amazing?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join thousands of developers building the future with AI
                        </p>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all font-bold text-xl"
                        >
                            Start Building Now - It's Free
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <i className="ri-code-box-line text-lg"></i>
                            </div>
                            <span className="text-xl font-bold">CodeCollab</span>
                        </div>
                        <div className="flex gap-6 text-gray-400">
                            <a href="#" className="hover:text-white transition-colors">About</a>
                            <a href="#" className="hover:text-white transition-colors">Features</a>
                            <a href="#" className="hover:text-white transition-colors">Pricing</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                                <i className="ri-twitter-x-line"></i>
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                                <i className="ri-github-line"></i>
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                                <i className="ri-discord-line"></i>
                            </a>
                        </div>
                    </div>
                    <div className="text-center mt-8 text-gray-500">
                        © 2025 CodeCollab. Built with ❤️ by developers, for developers.
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Landing
