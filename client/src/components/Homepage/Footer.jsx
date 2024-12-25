import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 max-w-screen-lg mt-16">
        <div className="flex flex-wrap justify-between">
          
          <div className="w-full sm:w-1/3 mb-6 sm:mb-0">
            <h2 className="text-xl font-bold">MeetSpot</h2>
            <p className="mt-2 text-gray-400">
              Connecting people for meaningful meetings and conversations.
            </p>
          </div>
          
          <div className="w-full sm:w-1/3 mb-6 sm:mb-0">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="/about" className="hover:text-blue-400">About Us</a></li>
              <li><a href="/contact" className="hover:text-blue-400">Contact</a></li>
              <li><a href="/faq" className="hover:text-blue-400">FAQ</a></li>
              <li><a href="/support" className="hover:text-blue-400">Support</a></li>
            </ul>
          </div>
          
          <div className="w-full sm:w-1/3">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="/terms" className="hover:text-blue-400">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-blue-400">Privacy Policy</a></li>
              <li><a href="/cookies" className="hover:text-blue-400">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center text-sm text-gray-500">
          
          <div className="flex space-x-4">
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-blue-400">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="hover:text-blue-400">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-blue-400">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-blue-400">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
          
          <div>&copy; {new Date().getFullYear()} Meeting Point. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
