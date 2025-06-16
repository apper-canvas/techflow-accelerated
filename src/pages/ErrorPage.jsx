import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const ErrorPage = () => {
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('message') || 'An error occurred';
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 via-blue-50 to-indigo-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      <div className="w-full max-w-md p-8 bg-white/80 dark:bg-surface-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-surface-200 dark:border-surface-700 text-center">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Authentication Error</h1>
        <p className="text-surface-700 dark:text-surface-300 mb-6">{errorMessage}</p>
        <Link to="/login" className="inline-block px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors">
          Return to Login
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;