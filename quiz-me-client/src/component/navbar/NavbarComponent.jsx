import { useState } from "react";
import "./navbar-style.css";
import { Link } from "react-router";
import { HomePath, MarksPath, ProfilePath } from "../client-route/Route";

const navBarButtonInactiveClassMame = "navbar__toggle";
const navBarButtonActiveClassMame = "navbar__toggle is-active";

const navBarMenuInactiveClassMame = "navbar__menu";
const navBarMenuActiveClassMame = "navbar__menu is-active";

export default function NavbarComponent () {

    const[navBarButtonClassName, setNavBarButtonClassName] = useState(navBarButtonInactiveClassMame);
    const[navBarMenuClassName, setNavBarMenuClassName] = useState(navBarMenuInactiveClassMame);

    function mobileNavBarButtonEventListener () {
        setNavBarButtonNextClassName (navBarButtonClassName, setNavBarButtonClassName);
        setNavBarMenuNextClassName (navBarMenuClassName, setNavBarMenuClassName);
    }

    return (
        <header className="navbar" role="banner">
            <div className="navbar__container">
                <a href="#" className="navbar__brand">QuizMe</a>
                <button className={navBarButtonClassName} 
                        id="navbarToggle" 
                        // aria-label="Toggle navigation" 
                        // aria-controls="navbarMenu" 
                        // aria-expanded="false"
                        onClick={() => mobileNavBarButtonEventListener()}
                        >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
                
                <nav id="navbarMenu" className={navBarMenuClassName} role="navigation" aria-labelledby="navbarToggle">
                    <ul className="navbar__list">
                        <li className="navbar__item">
                            <Link to={HomePath} className="navbar__link" onClick={() => mobileNavBarButtonEventListener()}>Ahabanza</Link>
                        </li>
                        <li className="navbar__item">
                            <Link to={MarksPath} className="navbar__link" onClick={() => mobileNavBarButtonEventListener()}>Amanota</Link>
                        </li>
                        <li className="navbar__item">
                            <Link to={ProfilePath} className="navbar__link" onClick={() => mobileNavBarButtonEventListener()}>Imikorere</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

function setNavBarButtonNextClassName (navBarButtonClassName, setNavBarButtonClassName)
{
    const nextNavBarButtonClassName = (navBarButtonClassName == navBarButtonActiveClassMame) ? navBarButtonInactiveClassMame : navBarButtonActiveClassMame;
    setNavBarButtonClassName(nextNavBarButtonClassName);
}

function setNavBarMenuNextClassName (navBarMenuClassName, setNavBarMenuClassName)
{
    const nextNavBarMenuClassName = (navBarMenuClassName == navBarMenuActiveClassMame) ? navBarMenuInactiveClassMame : navBarMenuActiveClassMame;
    setNavBarMenuClassName(nextNavBarMenuClassName);
}