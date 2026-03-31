// // src/components/Footer.tsx

// import { Link } from "react-router-dom";
// import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

// export default function Footer() {
//   return (
//     <footer className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-10 mt-12">
//       <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
//         {/* Logo / Branding */}
//         <div className="text-center md:text-left">
//           <h1 className="text-2xl font-bold mb-2">VoteMaster</h1>
//           <p className="text-gray-200 text-sm">
//             Empowering transparent and fair elections
//           </p>
//         </div>

//         {/* Navigation Links */}
//         <div className="flex gap-6 text-sm font-semibold">
//           <Link to="/" className="hover:underline">
//             Home
//           </Link>
//           <Link to="/about" className="hover:underline">
//             About
//           </Link>
//           <Link to="/contact" className="hover:underline">
//             Contact
//           </Link>
//           <Link to="/privacy" className="hover:underline">
//             Privacy Policy
//           </Link>
//         </div>

//         {/* Social Icons */}
//         <div className="flex gap-4">
//           <a href="#" className="hover:text-gray-300 transition">
//             <FaFacebookF />
//           </a>
//           <a href="#" className="hover:text-gray-300 transition">
//             <FaTwitter />
//           </a>
//           <a href="#" className="hover:text-gray-300 transition">
//             <FaLinkedinIn />
//           </a>
//           <a href="#" className="hover:text-gray-300 transition">
//             <FaGithub />
//           </a>
//         </div>
//       </div>

//       {/* Bottom Text */}
//       <div className="mt-6 text-center text-gray-200 text-sm">
//         &copy; {new Date().getFullYear()} VoteMaster. All rights reserved.
//       </div>
//     </footer>
//   );
// }