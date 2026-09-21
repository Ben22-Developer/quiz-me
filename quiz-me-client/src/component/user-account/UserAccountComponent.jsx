import { useDispatch, useSelector } from "react-redux";
import "./user-account-style.css";
import { LoadComponent } from "../loader/LoadComponent";
import ErrorComponent from "../error/ErrorComponent";
import ConfirmWindow from "../../window/ConfirmWindow";
import { useEffect, useRef, useState } from "react";
import { nullalizeUserDeleteOccuredError, userDelete } from "../../redux/slice/AuthSlice";
import { deleteAllLocalStorageQuizMarks } from "../../redux/store/LocalStorage";
import { googleLogout } from "@react-oauth/google";
import { nullalizeQuizResult } from "../../redux/slice/QuizSlice";
import { nullalizeUserClientData } from "../../redux/slice/UserSlice";

export default function UserAccountComponent ()
{
    const userClientData = useSelector((state) => state.user.userClientData);
    const userDeleteErrorOccured = useSelector((state) => state.user.userDeleteErrorOccured);
    const dispatch = useDispatch();
    const [userDeleteState, setUserDeleteState] = useState(false);
    const componentMount = useRef(true);

    function deleteAccount () 
    {
        const result = ConfirmWindow("Gukora iki gikorwa biratuma musibwa muri sisitemu ndetse n'amakuru yanyu agende burundu\n1. Kanda 'Ok' niba ubyemeza\n2.Kanda 'Cancel' maze niba utabishaka.");
        
        if (result)
            setUserDeleteState(!userDeleteState);
    }

    useEffect(() => {

        if (componentMount.current) {
            componentMount.current = false;
            return;
        }

        dispatch(userDelete());

    }, [userDeleteState]);

    return GetComponentToDisplay(userClientData, userDeleteErrorOccured, userDeleteState, deleteAccount, dispatch);
}

function GetComponentToDisplay (userClientData, userDeleteErrorOccured, userDeleteState, deleteAccount, dispatch)
{
    
    if (userDeleteErrorOccured != null)
        return <ErrorComponent error={"An error occured during the account delete"} errorHandler={() => dispatch(nullalizeUserDeleteOccuredError())}/>

    if (userDeleteState)
        return <LoadComponent />
    
    return (
        <>
        <section className="content-section">
            <h2>Ibikuranga</h2>
            <div className="profile-content-container">
                <p className="profile-content-paragraph">
                    <span className="greyish-text">Amazina: </span> 
                    <span>{userClientData.name}</span>
                </p>
                <p className="profile-content-paragraph">              
                    <span className="greyish-text">Imeyili: </span>
                    <span>{userClientData.username}</span>
                </p>                  
            </div>
        </section>        

        <section className="content-section danger-zone">
            <h2>Ibi bikorwa byitondere</h2>
            <p className="section-subtitle">Siba konti na buri kimwe cyose cyawe.</p>
            <button className="button danger" onClick={deleteAccount}>Siba</button>
        </section>            
        </>
    )
}