
'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ParticlesContainer from './ParticlesContainer';

const DemoPage = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = "Welcome to BitBox";

  useEffect(() => {
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.substring(0, currentIndex));
        currentIndex += 1;
      } else {
        clearInterval(intervalId);
      }
    }, 70); // Adjust typing speed by changing the interval

    return () => {
      clearInterval(intervalId);
    };
  }, [fullText]);

  return (
    <div className="h-full flex items-center justify-center mt-24 relative">
      <ParticlesContainer />
      <div className="rounded-lg p-8 max-w-md w-full flex flex-col items-center relative z-10">
        <h1 className="text-9xl font-bold mb-24 text-white relative typed-text">
          {typedText}
          <span className="border-box-animation"></span>
        </h1>
        <p className=" text-white text-center font-semibold text-lg">
  Revolutionizing the Future of Coding and Grading.
</p>
        <Link href="/demo">
          <button className=" mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 hover:animate-glow">
            Try Now!
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DemoPage;
