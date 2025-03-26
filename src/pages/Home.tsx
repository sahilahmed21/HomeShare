import React from 'react';

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to HomeShare</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Find Your Perfect Home</h2>
          <p className="text-gray-600 mb-4">
            Browse through our selection of beautiful homes and find the perfect place for your next stay.
          </p>
          <a
            href="/browse"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Browse Homes
          </a>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Share Your Home</h2>
          <p className="text-gray-600 mb-4">
            List your property and start earning by sharing your space with travelers from around the world.
          </p>
          <a
            href="/list"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            List Your Home
          </a>
        </div>
      </div>
    </div>
  );
}