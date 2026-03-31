// src/components/Home.tsx (without external icons)
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section - Premium Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]"></div>
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
              <span className="text-yellow-300 text-lg">✨</span>
              <span className="text-sm font-medium">Next-Gen Voting Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-purple-200">
              Secure Digital Voting
              <br />
              Made Simple
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Empowering democracy through transparent, secure, and real-time voting technology. 
              Cast your vote with confidence from anywhere in the world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-indigo-600 bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative">Get Started Now</span>
                <span className="relative ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/20 transition-all duration-300"
              >
                Sign In
                <span className="ml-1">→</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-purple-200">
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-lg">✓</span>
                <span>Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-lg">✓</span>
                <span>Real-Time Results</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-lg">✓</span>
                <span>Audit-Ready Logs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge technology to ensure every vote counts securely and efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                <span className="text-2xl group-hover:text-white transition-colors">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Military-Grade Security</h3>
              <p className="text-gray-600 leading-relaxed">
                End-to-end encryption and blockchain verification ensure your vote remains private, tamper-proof, and verifiable.
              </p>
              <div className="mt-4 flex items-center text-indigo-600 font-medium">
                Learn more <span className="ml-1">→</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                <span className="text-2xl group-hover:text-white transition-colors">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Live Analytics Dashboard</h3>
              <p className="text-gray-600 leading-relaxed">
                Track voter turnout and results in real-time with intuitive visualizations and instant updates.
              </p>
              <div className="mt-4 flex items-center text-purple-600 font-medium">
                Learn more <span className="ml-1">→</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-600 transition-colors duration-300">
                <span className="text-2xl group-hover:text-white transition-colors">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Platform Access</h3>
              <p className="text-gray-600 leading-relaxed">
                Vote seamlessly from desktop, tablet, or mobile device with our responsive, accessible interface.
              </p>
              <div className="mt-4 flex items-center text-pink-600 font-medium">
                Learn more <span className="ml-1">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">99.99%</div>
              <div className="text-purple-100">Uptime Record</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">10</div>
              <div className="text-purple-100">Votes Secured</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">10+</div>
              <div className="text-purple-100">Active Elections</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-purple-100">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, secure, and transparent voting process in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                <span className="text-3xl font-bold text-indigo-600">1</span>
                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 hidden md:block">
                  <span className="text-gray-300 text-xl">→</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Create Account</h3>
              <p className="text-gray-600">
                Register with your credentials and verify your identity securely
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                <span className="text-3xl font-bold text-purple-600">2</span>
                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 hidden md:block">
                  <span className="text-gray-300 text-xl">→</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cast Your Vote</h3>
              <p className="text-gray-600">
                Choose your candidates and submit your encrypted vote instantly
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-pink-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track Results</h3>
              <p className="text-gray-600">
                Watch live results and verify your vote on the blockchain
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make Your Voice Heard?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of voters who trust our platform for secure and transparent elections
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Start Voting Now
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">VoteSecure</h3>
              <p className="text-gray-400 text-sm">
                Empowering democracy through secure digital voting solutions.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link to="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/help" className="hover:text-white transition">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
                <li><Link to="/security" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Voting Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Tailwind Custom Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-white {
          background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default Home;