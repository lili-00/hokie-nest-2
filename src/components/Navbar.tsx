import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, LogIn, LogOut, UserPlus } from 'lucide-react';

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="font-bold text-xl">Hokie Nest</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/properties" className="hover:text-secondary transition-colors">
              Properties
            </Link>
            
            {user ? (
              <>
                <Link to="/profile" className="hover:text-secondary transition-colors">
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 hover:text-secondary transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-1 hover:text-secondary transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center space-x-1 hover:text-secondary transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}