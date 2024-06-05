"use client";
import Link from "next/link";
import React from 'react';

const Navbar: React.FC = () => {
    const linkData: string[] = ["Service", "Our Work", "About us", "Contact"];
    return (
        <nav className="w-full px-20 py-5 flex justify-between items-center font-['Neue Montreal'] absolute top-0">
            <div className='logo'> <h3 className="text-xl">Logo</h3></div>
            <div className='links flex gap-10'>
                {linkData.map((item, index) => (
                    <Link key={index} href="/" className={` text-lg capitalize ${index === 3 && "ml-32"}`}>
                        {item}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

export default Navbar;
