
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
function GetStarted() {
    const [showNavbar, setShowNavbar] = useState(true);
   
    const featuresRef = useRef(null);
    const scrollToFeatures = () => {
        featuresRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
  let lastY = window.scrollY;

  const handleScroll = () => {
    if (window.scrollY > lastY) {
      setShowNavbar(false); // scrolling down
    } else {
      setShowNavbar(true); // scrolling up
    }
    lastY = window.scrollY;
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, []);
    const navigate = useNavigate();
    

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 pt-20">

{/* bg-white/80 backdrop-blur-md shadow-sm */}

            {/* Navbar */}
            <nav
                className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4
  bg-white/80 backdrop-blur-md shadow-sm transition-transform duration-300
  ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
            >
                <h1 className="text-xl font-bold text-indigo-600">CampusConnect AI</h1>

                <div className="space-x-3">
                    <button

                        onClick={scrollToFeatures}

                        className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition"
                    >
                        Explore Features
                    </button>

                    <button
                        onClick={() => navigate("/login")}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                    >
                        Login
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-indigo-600 to-sky-500 text-white px-6 md:px-16 py-20">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                            Your AI-Powered Campus Companion

                        </h2>


                        <p className="mt-6 text-lg text-indigo-100">
                            Ask questions, find classrooms, explore events, and stay updated —
                            all in one smart chatbot built for your college life.
                        </p>

                        <button
                            onClick={() => navigate("/login")}
                            className="mt-8 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-2xl shadow hover:scale-105 transition"
                        >
                            Start Chatting
                        </button>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl text-center">
                        <p className="text-5xl">💬</p>
                        <p className="mt-4 text-lg">Ask Me Anything About Campus!</p>
                    </div>

                </div>
            </section>

            {/* Features */}
            <section ref={featuresRef} className="py-20 px-6 md:px-16">
                <h3 className="text-3xl font-bold text-center">What Can You Do?</h3>

                <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto mt-12">
                    <Feature title="College Events" icon="📅" desc="Stay updated with fests & holidays." />
                    <Feature title="Campus Navigation" icon="🗺️" desc="Find classrooms instantly." />
                    <Feature title="AI Assistance" icon="🤖" desc="Ask anything naturally." />
                    <Feature title="Announcements" icon="📢" desc="Never miss updates." />
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center">
                <h3 className="text-3xl font-bold">Ready to Explore Your Campus Smarter?</h3>

                <button
                    onClick={() => navigate("/login")}
                    className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition"
                >
                    Ask the Assistant
                </button>
            </section>

            <footer className="bg-white border-t py-6 text-center text-sm text-slate-500">
                CampusConnect AI © 2026 • OMKAR
            </footer>

        </div>
    );
}

function Feature({ title, icon, desc }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition">
            <div className="text-3xl">{icon}</div>
            <h4 className="text-lg font-semibold mt-3">{title}</h4>
            <p className="text-sm text-slate-600 mt-2">{desc}</p>
        </div>
    );
}

export default GetStarted;