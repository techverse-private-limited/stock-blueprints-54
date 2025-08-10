
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-6 px-4 md:px-6 lg:px-8 border-t border-slate-200 bg-white">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <p className="text-sm text-slate-600 font-poppins">
          © {new Date().getFullYear()} Stock Management System. All rights reserved.
        </p>
        <p className="text-sm text-slate-500 font-poppins">
          Powered by{' '}
          <a
            href="https://techverseinfotechprivatelimited.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline"
          >
            Techverse Infotech Private Limited
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
