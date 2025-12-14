import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    RiCodeBoxLine,
    RiPlayCircleLine,
    RiTwitterFill,
    RiGithubFill,
    RiDiscordFill,
    RiLinkedinFill,
    RiCheckboxCircleFill,
    RiArrowRightLine,
    RiShieldCheckFill,
    RiRocket2Fill,
    RiTeamFill,
    RiCloudLine,
    RiBarChartFill,
    RiSettings5Fill
} from "react-icons/ri";



const AnimatedBadge = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/5 border border-white/10 backdrop-blur-sm"
    >
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        {children}
        <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-semibold">NEW</span>
    </motion.div>
);

const GradientText = ({ children, className = "" }) => (
    <span className={`bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ${className}`}>
        {children}
    </span>
);

const Button = ({ variant = "primary", children, onClick, className = "", icon = null }) => {
    const baseStyles = "px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30",
        secondary: "bg-white/10 border border-white/20 text-white backdrop-blur-sm hover:bg-white/15",
        ghost: "text-gray-300 hover:text-white"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
            {icon && <span className="text-lg">{icon}</span>}
        </motion.button>
    );
};

const StatCard = ({ value, label, icon, color, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
    >
        <div className="flex items-start gap-4">
            <div className={`text-3xl ${color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                {icon}
            </div>
            <div className="flex-1">
                <div className="text-4xl md:text-5xl font-bold tracking-tight mb-1">{value}</div>
                <div className="text-base text-gray-400">{label}</div>
            </div>
        </div>
    </motion.div>
);

const FeatureCard = ({ icon, title, description, gradient, color, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.07, duration: 0.5 }}
        whileHover={{ y: -4 }}
        className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
    >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
        <div className="relative">
            <div className={`text-3xl mb-4 ${color} opacity-90`}>
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 tracking-tight">{title}</h3>
            <p className="text-base text-gray-400 leading-relaxed">{description}</p>
            <div className="mt-5 pt-5 border-t border-white/10">
                <button className="text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1.5 group-hover:gap-2 transition-all">
                    Learn more
                    <RiArrowRightLine className="text-sm" />
                </button>
            </div>
        </div>
    </motion.div>
);

const TestimonialCard = ({ quote, author, role, avatar, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] rounded-2xl p-6 border border-white/10"
    >
        <div className="text-3xl text-gray-500 mb-4">"</div>
        <p className="text-base text-gray-300 leading-relaxed mb-6 italic">
            {quote}
        </p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold">
                {avatar}
            </div>
            <div>
                <div className="text-base font-semibold">{author}</div>
                <div className="text-sm text-gray-400">{role}</div>
            </div>
        </div>
    </motion.div>
);

const SectionHeader = ({ title, subtitle }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
    >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            {title}
        </h2>
        {subtitle && (
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                {subtitle}
            </p>
        )}
    </motion.div>
);



const Landing = () => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.5]);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const navLinks = ["Features", "Solutions", "Pricing", "Docs"];

    const features = [
        {
            icon: <RiCodeBoxLine />,
            title: "AI-Powered Coding",
            description: "Generate production-ready code with natural language. Complete functions, debug errors, and write tests instantly.",
            gradient: "from-blue-500/20 to-cyan-500/20",
            color: "text-blue-400"
        },
        {
            icon: <RiTeamFill />,
            title: "Real-time Collaboration",
            description: "Code together with live cursors, voice chat, and comments. See changes as they happen.",
            gradient: "from-purple-500/20 to-pink-500/20",
            color: "text-purple-400"
        },
        {
            icon: <RiRocket2Fill />,
            title: "Instant Deployment",
            description: "One-click deploy to global edge network. Automatic SSL, CDN, and rollbacks included.",
            gradient: "from-green-500/20 to-emerald-500/20",
            color: "text-green-400"
        },
        {
            icon: <RiCloudLine />,
            title: "Cloud Environments",
            description: "Full development environment in the cloud. No setup required, work from anywhere.",
            gradient: "from-orange-500/20 to-red-500/20",
            color: "text-orange-400"
        },
        {
            icon: <RiBarChartFill />,
            title: "Real-Time Monitoring",
            description: "Monitor your websites 24/7 with automatic checks every minute. Get instant status updates.",
            gradient: "from-violet-500/20 to-purple-500/20",
            color: "text-violet-400"
        },
        {
            icon: <RiSettings5Fill />,
            title: "Instant Telegram Alerts",
            description: "Receive beautiful, formatted alerts on Telegram the moment your website goes down or recovers.",
            gradient: "from-gray-500/20 to-blue-500/20",
            color: "text-gray-400"
        },
        {
            icon: <RiSettings5Fill />,
            title: "AI-Powered Analysis",
            description: "Get intelligent code reviews, performance tips, and SEO recommendations from Google Gemini AI.",
            gradient: "from-gray-500/20 to-blue-500/20",
            color: "text-gray-400"
        },
        {
            icon: <RiSettings5Fill />,
            title: "Performance Metrics",
            description: "Track response times, uptime percentage, PageSpeed scores, and SEO metrics in real-time.",
            gradient: "from-gray-500/20 to-blue-500/20",
            color: "text-gray-400"
        },
        {
            icon: <RiSettings5Fill />,
            title: "GitHub Integration",
            description: "Connect your repositories and get AI-powered code analysis with security vulnerability detection.",
            gradient: "from-gray-500/20 to-blue-500/20",
            color: "text-gray-400"
        },
    ];

    const stats = [
        { value: "10K+", label: "Active Teams", icon: <RiTeamFill />, color: "text-blue-400" },
        { value: "2M+", label: "Lines Generated", icon: <RiCodeBoxLine />, color: "text-purple-400" },
        { value: "99.9%", label: "Uptime SLA", icon: <RiShieldCheckFill />, color: "text-emerald-400" },
    ];

    const testimonials = [
        {
            quote: "Reduced our deployment time from days to minutes. The AI code suggestions alone save us 20+ hours per week.",
            author: "Sarah Chen",
            role: "CTO, TechScale",
            avatar: "SC"
        },
        {
            quote: "The real-time collaboration features transformed how our remote team works. It's like pair programming from anywhere.",
            author: "Marcus Rodriguez",
            role: "Lead Developer, CloudStack",
            avatar: "MR"
        },
        {
            quote: "Best developer experience I've had. The platform just gets out of your way and lets you build amazing things.",
            author: "Alex Johnson",
            role: "Senior Engineer, StartupXYZ",
            avatar: "AJ"
        },
    ];

    return (
        <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)] opacity-20" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
            </div>

            {/* Navbar */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="fixed top-0 w-full z-50 backdrop-blur-2xl bg-black/60 border-b border-white/10"
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2.5 cursor-pointer group"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
                                {/* <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                                    <RiCodeBoxLine className="text-lg" />
                                </div> */}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold tracking-tight">CodeCollab</span>
                                <span className="px-2 py-0.5 text-[10px] rounded-md bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 font-bold uppercase tracking-wider">
                                    AI
                                </span>
                            </div>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((item) => (
                                <motion.a
                                    key={item}
                                    whileHover={{ y: -1 }}
                                    className="relative px-4 py-2 text-sm text-gray-300 hover:text-white cursor-pointer font-medium transition-colors group"
                                >
                                    {item}
                                    <span className="absolute bottom-1 left-4 right-4 h-px bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                </motion.a>
                            ))}
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-3">
                            <button
                                onClick={() => navigate("/login")}
                                className="px-4 py-2 text-sm text-gray-300 hover:text-white font-medium transition-colors"
                            >
                                Sign In
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/register")}
                                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-shadow"
                            >
                                Get Started
                            </motion.button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
                        >
                            <div className="w-6 h-5 flex flex-col justify-between">
                                <motion.span
                                    animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                    className="w-full h-0.5 bg-current rounded-full transition-all"
                                />
                                <motion.span
                                    animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                    className="w-full h-0.5 bg-current rounded-full transition-all"
                                />
                                <motion.span
                                    animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                                    className="w-full h-0.5 bg-current rounded-full transition-all"
                                />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <motion.div
                    initial={false}
                    animate={mobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                    className="lg:hidden overflow-hidden border-t border-white/10 bg-black/80 backdrop-blur-2xl"
                >
                    <div className="px-6 py-4 space-y-1">
                        {navLinks.map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium"
                            >
                                {item}
                            </a>
                        ))}
                        <div className="pt-4 space-y-2 border-t border-white/10">
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium text-left"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate("/register")}
                                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold shadow-lg"
                            >
                                Get Started Free
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.nav>

            {/* Hero */}
            <motion.section style={{ opacity }} className="relative pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <AnimatedBadge>
                            🎯 AI-Powered Collaborative Development
                        </AnimatedBadge>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-8 text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]"
                        >
                            Build Software
                            <br />
                            <GradientText>Faster Together</GradientText>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-8 text-xl md:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto"
                        >
                            The complete platform for modern development teams.{" "}
                            <span className="text-blue-300">Real-time collaboration</span>,{" "}
                            <span className="text-purple-300">AI-powered tools</span>, and{" "}
                            <span className="text-pink-300">instant deployment</span>.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
                        >
                            <Button
                                variant="primary"
                                onClick={() => navigate("/home")}
                                icon={<RiArrowRightLine />}
                                className="text-lg px-10 py-4"
                            >
                                Start Building Free
                            </Button>
                            <Button variant="secondary" icon={<RiPlayCircleLine />} className="text-lg px-10 py-4">
                                Watch Demo
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-12"
                        >
                            <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider font-medium">Trusted by teams at</p>
                            <div className="flex flex-wrap justify-center gap-8 text-gray-500 font-semibold text-lg">
                                {["Google", "Microsoft", "Spotify", "Shopify", "Netflix"].map((company) => (
                                    <div key={company} className="hover:text-gray-300 transition-colors">
                                        {company}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Stats */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {stats.map((stat, index) => (
                            <StatCard key={stat.label} {...stat} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <SectionHeader
                        title={<>Everything You Need to <GradientText>Ship Faster</GradientText></>}
                        subtitle="A complete suite of tools designed for modern development workflows"
                    />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((feature, index) => (
                            <FeatureCard key={feature.title} {...feature} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Code Preview */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gray-900/50">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                </div>
                                <span className="text-xs text-gray-400 font-mono">Button.tsx</span>
                            </div>
                            <div className="text-xs text-gray-400 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                3 collaborators
                            </div>
                        </div>
                        <div className="p-6 font-mono text-sm overflow-x-auto">
                            <div className="flex gap-6">
                                <div className="text-gray-600 text-right select-none">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                        <div key={n} className="h-5 leading-5">{n}</div>
                                    ))}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div><span className="text-purple-400">import</span> <span className="text-gray-300">{'{ useState }'}</span> <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span></div>
                                    <div className="h-5" />
                                    <div><span className="text-cyan-400">export</span> <span className="text-purple-400">const</span> <span className="text-yellow-300">Button</span> <span className="text-gray-300">= () =&gt; {'{'}</span></div>
                                    <motion.div
                                        animate={{ backgroundColor: ["rgba(59,130,246,0.05)", "rgba(59,130,246,0.15)", "rgba(59,130,246,0.05)"] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="pl-4 rounded"
                                    >
                                        <span className="text-purple-400">const</span> <span className="text-gray-300">[count, setCount] = </span><span className="text-yellow-300">useState</span><span className="text-gray-300">(0)</span>
                                    </motion.div>
                                    <div className="h-5" />
                                    <div className="pl-4"><span className="text-purple-400">return</span> <span className="text-gray-300">&lt;</span><span className="text-blue-400">button</span><span className="text-gray-300">&gt;...&lt;/</span><span className="text-blue-400">button</span><span className="text-gray-300">&gt;</span></div>
                                    <div><span className="text-gray-300">{'}'}</span></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <SectionHeader
                        title={<>Loved by Developers <span className="text-purple-400">Worldwide</span></>}
                        subtitle="Join thousands of teams who ship faster with CodeCollab"
                    />
                    <div className="grid md:grid-cols-3 gap-4">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard key={index} {...testimonial} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
                        <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 border border-white/10 backdrop-blur-xl rounded-3xl p-12 text-center">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                                Ready to Transform Your <GradientText>Development Workflow?</GradientText>
                            </h2>
                            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Join thousands of developers building the future. Start for free, no credit card required.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button onClick={() => navigate("/register")} className="px-12 py-5 text-lg">
                                    Get Started Free
                                </Button>
                                <Button variant="secondary" className="px-12 py-5 text-lg">
                                    Schedule a Demo
                                </Button>
                            </div>
                            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                                {["No credit card required", "Free forever plan", "Cancel anytime"].map((item) => (
                                    <div key={item} className="flex items-center gap-1.5">
                                        <RiCheckboxCircleFill className="text-green-500 text-sm" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid md:grid-cols-5 gap-8 mb-10">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                    <RiCodeBoxLine className="text-lg" />
                                </div>
                                <span className="text-lg font-bold">CodeCollab</span>
                            </div>
                            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                                The complete platform for modern development teams. Build, collaborate, and deploy faster.
                            </p>
                        </div>
                        {["Product", "Company", "Resources", "Legal"].map((category) => (
                            <div key={category}>
                                <h3 className="text-sm font-semibold mb-3">{category}</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    {["Link 1", "Link 2", "Link 3"].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="hover:text-white transition-colors">
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-xs text-gray-500">
                            © {new Date().getFullYear()} CodeCollab Inc. All rights reserved.
                        </div>
                        <div className="flex gap-4">
                            {[
                                { icon: <RiTwitterFill />, label: "Twitter" },
                                { icon: <RiGithubFill />, label: "GitHub" },
                                { icon: <RiDiscordFill />, label: "Discord" },
                                { icon: <RiLinkedinFill />, label: "LinkedIn" },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;