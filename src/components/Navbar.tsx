import React, { useState } from 'react';
import { Menu, X, Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Home className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">HomeShare</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Home</a>
            <a href="/browse" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Browse Homes</a>
            {user ? (
              <>
                <a href="/list" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">List Your Home</a>
                <button
                  onClick={logout}
                  className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Login</a>
                <a href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Sign Up
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Home</a>
            <a href="/browse" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Browse Homes</a>
            {user ? (
              <>
                <a href="/list" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">List Your Home</a>
                <button
                  onClick={logout}
                  className="flex items-center w-full text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">Login</a>
                <a href="/register" className="block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}