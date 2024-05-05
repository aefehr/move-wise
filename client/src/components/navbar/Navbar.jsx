import "./Navbar.scss"
import React, { useState } from 'react';

//TODO: fix hrev / link to...
function Navbar() {
    const [open, setOpen] = useState(false)

    return (
        <nav>
            <div className="left">
                <a href="/" className="logo">
                    <img src="/MW_logo.png" alt="" />
                    <span>Move Wise</span>
                </a>
                <a href="/">Home</a>
                <a href="/cities">Cities</a>
                <a href="/companies">Companies</a>
                <a href="/market_explorer">Market Explorer</a>
            </div>
            <div className="right">
                {/* <a href="/">Sign in</a>
                <a href="/" className="register">Sign up</a> */}
                <div className="menuIcon">
                    <img
                        src="/menu.png"
                        alt=""
                        onClick={() => setOpen((prev) => !prev)}
                    />
                </div>
                <div className={open ? "menu active" : "menu"}>
                    <a href="/">Home</a>
                    <a href="/cities">Cities</a>
                    <a href="/companies">Companies</a>
                    <a href="/market_explorer">Market Explorer</a>
                    {/* <a href="/">Sign in</a>
                    <a href="/">Sign up</a> */}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;