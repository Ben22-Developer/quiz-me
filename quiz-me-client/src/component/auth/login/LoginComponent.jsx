import "./login-component-style.css";
import { useDispatch, useSelector } from "react-redux";
import { nullalizeLoginOccuredError, userLogin } from "../../../redux/slice/AuthSlice";
import { LoadComponent } from "../../loader/LoadComponent";
import ErrorComponent from "../../error/ErrorComponent";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { HomePath } from "../../client-route/Route";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginComponent ()
{
    const dispatch = useDispatch();
    const hasLoginSession = useSelector((state) =>  state.auth.hasLoginSession);
    const errorOccured = useSelector((state) => state.auth.loginErrorOccured);
    const userData = useSelector((state) => state.user.userClientData);
    const lastAccessedUnauthenticatedUrl = useSelector((state) => state.auth.lastAccessedUnauthenticatedUrl);
    

    const [userLoginProcessing, setUserLoginProcessing] = useState(false);
    const [googleAuthCode, setGoogleAuthCode] = useState(null);
    const navigate = useNavigate();

    const login = useGoogleLogin(
    {
        onSuccess: (code) =>
            { 
                setUserLoginProcessing(true);
                setGoogleAuthCode({"code" : code["code"]});
            },
        onError: (error) => <ErrorComponent error={error.error_description}/>,
        flow:"auth-code"
    });


    useEffect(() => 
    {
        if (userData == null) {
            return;
        }

        pageNavigate (navigate, lastAccessedUnauthenticatedUrl);

    }, [userData]);

    useEffect(() => 
    {
        if (googleAuthCode == null) {
            return;
        }

        dispatch(userLogin(googleAuthCode));
    }, [googleAuthCode]);


    return (
        <div className="body">
            <div className="login-container">
                <div className="login-box">
                    <Title />
                    {UnderTitleDiv(userLoginProcessing, setUserLoginProcessing, login, dispatch, errorOccured, hasLoginSession, navigate, setGoogleAuthCode)}
                </div>
            </div>
        </div>
    )
}

function Title () 
{
    return (
        <div>
            <h2>Quiz Me</h2>
            <p className="subtitle">Injira ku rubuga ukoresheje konti yawe ya Google</p>
        </div>
    )
}

function UnderTitleDiv (userLoginProcessing, setUserLoginProcessing, login, dispatch, errorOccured, hasLoginSession, navigate, setGoogleAuthCode)
{
    if (hasLoginSession) {
        return <ErrorComponent error={`Muri muri sisitemu nta mpamvu yo kongera kwinjizwa`} errorHandler={() => {dispatch(navigate(HomePath)); }} buttonText={"Subira ahabanza"}/>
    }

    if (errorOccured != null) {
        return <ErrorComponent error={`Hari ikibazo kibaye turi kubinjiza muri sisitemu`} buttonText={"Ongera ugerageze kwinjira"} errorHandler={() => {dispatch(nullalizeLoginOccuredError()); setGoogleAuthCode(null); setUserLoginProcessing(false)}}/>
    }

    if (userLoginProcessing)
    {
        return (
        <>
            <LoadComponent />
            <p className="subtitle">
                Sisitemu iri gukusanya amakuru <br />
                Mwihangane gatoya
            </p>
        </>
        )
    }

    return(
    <div>
        <button className="button login-button" onClick={login} disabled={false}>
            <GoogleSVG />
            <span>Injira ku rubuga</span>
        </button>                        
        
    </div>);
}


function GoogleSVG ()
{
    return (
        <svg width="20px" height="20px" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/></svg>
    )
}

function pageNavigate (navigate, lastAccessedUnauthenticatedUrl)
{
    if (lastAccessedUnauthenticatedUrl != null) 
    {
        navigate(lastAccessedUnauthenticatedUrl);
    }
    else 
    {
        navigate(HomePath);
    }
}