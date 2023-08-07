// React Support
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

// MUI Support
import Drawer from "@mui/material/Drawer";
import { Mail } from '@mui/icons-material';

// Sidebar SVGs
import {
    DatabaseSVG,
    DiscussionSVG,
    HomeSVG,
    LogoutSVG,
    SettingSVG,
    StudentSVG,
    TeacherSVG,
    AssignmentSVG,
    NotesSVG,
    LibrarySVG,
} from "./SidebarSVG.jsx";

//assets
import logo from "../../assets/navlogo.png";
import { useContext } from "react";
import { AdminContext } from "../../contexts.js";
import Image from "./Image.jsx";
// import { LibraryAdd } from "@mui/icons-material";

// Navbar Item Components
const NavItem = ({ to, children, collapseMenu, onClick }) => {
    return (
        <NavLink
            onClick={onClick}
            to={to}
            className={({ isActive }) =>
                `${isActive
                    ? "bg-[#1B3B7D33] text-[#1B3B7D]"
                    : "bg-transparent text-[#7A7C88]"
                } ${collapseMenu ? "justify-center gap-0" : "justify-start gap-3"
                } flex items-center !text-sm font-semibold  rounded-md duration-300 px-3 py-1.5 mt-1 hover:bg-[#0064E133] hover:text-[#1B3B7D]`
            }
        >
            {children}
        </NavLink>
    );
};

const SideBar = () => {
    const [open, setOpen] = useState(false);
    const [collapseMenu, setCollapseMenu] = useState(false);

    const { admin, logOut } = useContext(AdminContext);

    const menuLinks = [
        {
            path: "/",
            label: "Home",
            icon: <HomeSVG />,
        },
        {
            path: "/centralized-library",
            label: "Library",
            icon: <LibrarySVG />,
        },
        {
            path: "/modules",
            label: "Modules",
            icon: <LibrarySVG />,
        },
        {
            path: "/institute",
            label: "Instiute",
            icon: <LibrarySVG />,
        },
        {
            path: "/university",
            label: "University",
            icon: <LibrarySVG />,
        },
        {
            path: "/discussion",
            label: "Community",
            icon: <DiscussionSVG />,
        },
        {
            path: "/blogs",
            label: "Blogs",
            icon: <DiscussionSVG />,
        },
        {
            path: "/students",
            label: "Students",
            icon: <DiscussionSVG />,
        },
        {
            path: "/loan-query",
            label: "Loan Query",
            icon: <DiscussionSVG />,
        },
        {
            path: "/visa-query",
            label: "Visa Query",
            icon: <DiscussionSVG />,
        },
        {
            path: "/sessions",
            label: "Sessions",
            icon: <DiscussionSVG />,
        },
        {
            path: "/invoice-email",
            label: "Send Invoice",
            icon: <Mail className="!w-5 !h-5" />,
        },
    ];

    return (
        <>
            {/* Larger device menu */}
            <div
                className={`${collapseMenu && "!w-auto"
                    }  lg:w-48 xl:w-56 hidden lg:flex flex-col h-full justify-between`}
            >
                <div className={`space-y-2 ${collapseMenu ? "mt-6" : "mt-0"}`}>
                    <div className="flex items-start justify-start pt-5 pl-[0.3rem]">
                        <img
                            src={logo}
                            alt="Logo"
                            className={`w-44 max-w-full duration-500 h-auto py-6`}
                        />
                    </div>
                    <div className="flex-1 px-2">
                        <ul className="pt-2 pb-4 navbar">
                            {menuLinks.map((item, index) => (
                                <li className="navItem" key={index}>
                                    <NavItem to={item.path} collapseMenu={collapseMenu}>
                                        {item.icon}
                                        <span
                                            className={`${collapseMenu ? "w-0 h-0" : "w-auto h-auto"
                                                } overflow-hidden duration-300`}
                                        >
                                            {item.label}
                                        </span>
                                    </NavItem>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="px-2 pb-3">
                    <div className="flex-1">
                        <ul className="pt-2 navbar">
                            <li className="navItem">
                                <NavItem to="/settings" collapseMenu={collapseMenu}>
                                    <SettingSVG />
                                    <span
                                        className={`${collapseMenu ? "w-0 h-0" : "w-auto h-auto"
                                            } overflow-hidden duration-300`}
                                    >
                                        Settings
                                    </span>
                                </NavItem>
                            </li>
                            <li className="navItem mb-2">
                                <NavItem
                                    to="/logout"
                                    onClick={logOut}
                                    collapseMenu={collapseMenu}
                                >
                                    <LogoutSVG />
                                    <span
                                        className={`${collapseMenu ? "w-0 h-0" : "w-auto h-auto"
                                            } overflow-hidden duration-300`}
                                    >
                                        Log Out
                                    </span>
                                </NavItem>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* mobile navbar  */}
            <div className="lg:hidden">
                <div className="py-2 px-5 flex items-center justify-between border-b border-[#DCDEE1]">
                    <button onClick={() => setOpen(true)} className="text-black">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className={`w-6 h-6`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>
                    <h2 className="text-xl font-semibold md:hidden">
                        Hello {admin?.name}
                    </h2>

                </div>
                <Drawer anchor={"left"} open={open} onClose={() => setOpen(false)}>
                    <div className="w-64 bg-[#fff] h-full flex flex-col justify-between rounded-r-2xl">
                        <div className={`space-y-2 ${collapseMenu ? "mt-6" : "mt-0"}`}>
                            <div className="flex items-center justify-center pt-5">
                                <img
                                    src={logo}
                                    alt="Logo"
                                    className={`w-auto max-w-full duration-500 h-auto`}
                                />
                            </div>
                            <div className="flex-1 px-2">
                                <ul className="pt-2 pb-4">
                                    {menuLinks.map((item, index) => (
                                        <li className="navItem" key={index}>
                                            <NavItem to={item.path}>
                                                {item.icon}
                                                <span className={`duration-300`}>{item.label}</span>
                                            </NavItem>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="px-2 pb-3">
                            <div className="flex-1">
                                <ul className="pt-2">
                                    <li className="navItem">
                                        <NavItem to="/settings">
                                            <SettingSVG />
                                            <span className={`duration-300`}>Settings</span>
                                        </NavItem>
                                    </li>
                                    <li className="navItem">
                                        <NavItem onClick={logOut}>
                                            <LogoutSVG />
                                            <span className={`duration-300`}>Log Out</span>
                                        </NavItem>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Drawer>
            </div>
            {/* Mobile device menu */}
        </>
    );
};

export default SideBar;
