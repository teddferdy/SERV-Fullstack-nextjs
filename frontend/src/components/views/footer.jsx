import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Servd Logo"
            width={48}
            height={48}
            className="w-14"
          />
        </div>
        <p className="text-stone-500 text-sm">Made with 💗 by RoadsideCoder</p>
      </div>
    </footer>
  );
};

export default Footer;
