"use client";
import LanguageIcon from "@mui/icons-material/Language";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LoginIcon from "@mui/icons-material/Login";
import { ChatBubbleTwoTone, Menu } from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import AccountPopover from "./dashboard/AccountPopover";
import Notifications from "./dashboard/Notifications";
import ThemeButton from "./ThemeButton";

function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { currentUser, isLoggedIn } = useSelector((state) => state.auth);
  const [res, setRes] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // const { theme, toggleTheme } = useTheme();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  function handleToggle() {
    setRes(!res);
  }

  const navlinks = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
  ];

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed w-full z-10"
    >
      <div className="w-9/10 bg-background dark:bg-background-dark shadow-[0_5px_35px_rgba(0,0,0,0.25)] dark:shadow-[0_0_10px_rgba(255,255,255,0.25)] mx-auto flex mt-4 max-md:py-2 rounded-lg">
        <div className="flex max-md:flex-col grow">
          <div className="flex justify-between items-stretch grow px-4">
            <div className="logo flex items-center gap-1">
              <span className="w-16">
                <img className="w-full" src="/logo-blue-2.png" alt="" />
              </span>
              <span className="text-primary dark:text-primary-dark text-xl font-bold">
                SharkStage
              </span>
            </div>
            <div className="navlinks hidden md:flex gap-1 text-lg self-stretch">
              {navlinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={`flex items-center px-4 dark:text-background hover:text-primary dark:hover:text-primary-dark relative transition-colors ${
                    isActive(link.href)
                      ? "text-primary dark:text-primary-dark"
                      : ""
                  }`}
                >
                  {link.name}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="active-link"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-primary dark:bg-primary-dark"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>
            <div className="icons hidden md:flex items-center gap-4 dark:text-background">
              {isLoggedIn ? (
                <>
                  <Notifications />
                  <Link href={"/chat"}>
                    <ChatBubbleTwoTone />
                  </Link>
                </>
              ) : null}
              {/* <LanguageIcon className="cursor-pointer " /> */}
              <ThemeButton />
            </div>
            <div
              onClick={handleToggle}
              className="cursor-pointer md:hidden flex items-center dark:text-background"
            >
              <Menu />
            </div>
          </div>

          <div
            className={`responsivebar dark:text-background md:hidden w-full bg-background dark:bg-background-dark flex flex-col gap-4 items-center overflow-hidden transition-all duration-300 ${
              res ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0"
            }`}
          >
            {navlinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`flex items-center px-4 hover:text-primary transition-colors ${
                  isActive(link.href)
                    ? "text-primary dark:text-primary-dark font-semibold"
                    : ""
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/sign/in"
              className="bg-primary text-lg  text-white rounded-lg px-4 py-2 cursor-pointer"
            >
              Login <LoginIcon />
            </Link>
            <div className="icons flex md:hidden items-center gap-4">
              {isLoggedIn ? (
                <>
                  <Notifications />
                  <Link href={"/chat"}>
                    <ChatBubbleTwoTone />
                  </Link>
                </>
              ) : null}
              <LanguageIcon className="cursor-pointer" />
              <ThemeButton />
            </div>
          </div>
        </div>
        {isLoggedIn ? (
          <>
            <div
              onClick={handleClick}
              className="bg-primary text-lg max-md:hidden text-white border-2 rounded-e-lg border-primary hover:text-primary transition-colors hover:bg-transparent px-8 py-4 cursor-pointer"
            >
              {currentUser.firstName + " " + currentUser.lastName}{" "}
              <KeyboardArrowDownIcon />
            </div>
            <AccountPopover anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
          </>
        ) : (
          <Link
            href="/sign/in"
            className="bg-primary  text-lg max-md:hidden text-white border-2 rounded-e-lg border-primary hover:text-primary dark:hover:text-primary-dark transition-colors hover:bg-transparent px-8 py-4 cursor-pointer"
          >
            Login <LoginIcon />
          </Link>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;
