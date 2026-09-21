import { Link, Outlet } from "react-router";
import "./profile-component-style.css";
import { MarksProfilePath, UserAccountProfilePath } from "../client-route/Route";
import NavbarComponent from "../navbar/NavbarComponent";
import { useDispatch, useSelector } from "react-redux";
import ErrorComponent from "../error/ErrorComponent";
import { LoadComponent } from "../loader/LoadComponent";
import { googleLogout } from "@react-oauth/google";
import { useEffect, useRef, useState } from "react";
import { nullalizeLogoutOccuredError, nullalizeUserDeleteOccuredError, userLogout } from "../../redux/slice/AuthSlice";
import ConfirmWindow from "../../window/ConfirmWindow";
import { nullalizeQuizResult } from "../../redux/slice/QuizSlice";
import { nullalizeUserClientData } from "../../redux/slice/UserSlice";


export default function ProfileComponent ()
{

    const userClientData = useSelector((state) => state.user.userClientData);

    const logoutErrorOccured = useSelector((state) => state.auth.logoutErrorOccured);

    const [userIsLoggingOut, setUserLoggingOut] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {

        if (!userIsLoggingOut) {
            return;
        }

        googleLogout();
        dispatch(userLogout());

    }, [userIsLoggingOut])    

    function userLogoutFunction () {
        const result = ConfirmWindow("Ese koko murashaka gusohoka muri sisitemu?\n1.Kanda 'Ok' niba ubyemeza\n2.Kanda 'Cancel' niba ubihakana");

        if (result) {
            setUserLoggingOut(true);
        }
    }

    console.log(logoutErrorOccured)
    
    return GetComponentToDisplay (userClientData, logoutErrorOccured, userIsLoggingOut, setUserLoggingOut, userLogoutFunction, dispatch);
}

function GetComponentToDisplay (userClientData, logoutErrorOccured, userIsLoggingOut, setUserLoggingOut, userLogoutFunction, dispatch)
{
    

    if (logoutErrorOccured != null)
        return <ErrorComponent error={"Hari ikibazo kibaye turi kubasohora muri sisitemu"} buttonText={"Ongera ugerageze gusohoka muri sisitemu"} errorHandler={() => { dispatch(nullalizeLogoutOccuredError()); setUserLoggingOut(false); }}/>

    if (userIsLoggingOut)
        return <LoadComponent />



    return (
        <>
            <NavbarComponent />
            <div className="body">
                <div className="account-container">
                    <ProfileSidebar userClientData={userClientData} userLogoutFunction={userLogoutFunction}/>
                    <div className="account-content">
                        <Outlet />
                    </div>
                </div>            
            </div>
        </>

    );
}

function ProfileSidebar (props)
{
    const userClientData = props.userClientData;

    return (
        <aside className="account-sidebar">
            <div className="profile-header">
                <div className="avatar-container">
                    <img src={userClientData.profilePictureUrl} alt="User Avatar" className="profile-avatar" />
                </div>
                <h3 className="user-name">{userClientData.name}</h3>
                <p className="greyish-text">QuizMe member</p>
            </div>
            
            <nav className="sidebar-nav">
                <Link to={UserAccountProfilePath} className="nav-item">Konti yajye</Link>
                <Link to={MarksProfilePath} className="nav-item">Amanota yajye</Link>
                <p className="nav-item logout" onClick={props.userLogoutFunction}>Sohoka muri sisitemu</p>
            </nav>
        </aside>        
    )
}