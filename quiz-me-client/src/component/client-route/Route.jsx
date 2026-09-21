import { createBrowserRouter, Outlet, } from "react-router"
import HomeComponent from "../home/HomeComponent";
import MarksComponent from "../marks/MarksComponent";
import QuizComponent from "../quiz/QuizComponent";
import LoginComponent from "../auth/login/LoginComponent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { hasLoginSessionCheck, } from "../../redux/slice/AuthSlice";
import { LoadComponent } from "../loader/LoadComponent";
import ErrorComponent from "../error/ErrorComponent";
import { userClientDataFetch } from "../../redux/slice/UserSlice";
import ProfileComponent from "../profile/ProfileComponent"; 
import UserAccountComponent from "../user-account/UserAccountComponent";
import { submitQuiz } from "../../redux/slice/QuizSlice";


const HomePathOnly = "home";
const MarksPathOnly = "marks";
const QuizPathOnly = "quiz";
const LoginPathOnly = "login";
const ProfilePathOnly = "profile";
const UserAccountPathOnly = "user-account";

const RoutePath = "/";

export const HomePath = RoutePath + HomePathOnly;
export const MarksPath = RoutePath + MarksPathOnly;
export const QuizPath = RoutePath + QuizPathOnly;
export const LoginPath = RoutePath + LoginPathOnly;
export const ProfilePath = RoutePath + ProfilePathOnly;
export const UserAccountProfilePath = ProfilePath + RoutePath + UserAccountPathOnly;
export const MarksProfilePath = ProfilePath + RoutePath + MarksPathOnly;

function ProtectedRoutes ()
{
    const hasLoginSession = useSelector((state) =>  state.auth.hasLoginSession);

    const authErrorOccured = useSelector((state) => state.auth.authErrorOccured);

    const userErrorOccured = useSelector((state) => state.user.errorOccured);

    const userClientData = useSelector((state) => state.user.userClientData);

    const dispatch = useDispatch();

    useEffect(() => 
    {
        dispatch(hasLoginSessionCheck());

    },[]);

    useEffect(() => 
    {
        if (hasLoginSession == true && userClientData == null ) {
            dispatch(userClientDataFetch());
        }
        
    },[hasLoginSession]);


    if (hasLoginSession == null)
    {
        return <LoadComponent />
    }

    if (hasLoginSession == true && userClientData == null ) {
        return <LoadComponent />
    }
    
    if (authErrorOccured != null || userErrorOccured != null)
    {
        return <ErrorComponent error={authErrorOccured} errorHandler={() => window.location.reload()}/>
    }


    
    return hasLoginSession ? <Outlet /> : <LoginComponent />;  
}

const router = createBrowserRouter(
[
    {
        path: "/",
        element: <ProtectedRoutes />,
        children:
        [
            {
                path: HomePathOnly,
                element: <HomeComponent />
            },
            {
                path: MarksPath,
                element: <MarksComponent/>
            },
            {
                element: <QuizComponent />,
                path: QuizPath
            },
            {
                element: <LoginComponent />,
                path: LoginPath
            },
            {
                element: <ProfileComponent />,
                path: ProfilePath,
                children: [
                    {
                        element: <UserAccountComponent />,
                        path: UserAccountProfilePath
                    },
                    {
                        element: <MarksComponent DontShowNavbar={true}/>,
                        path: MarksProfilePath
                    }
                ]
            },            
        ]
    },
]
);

export default router;