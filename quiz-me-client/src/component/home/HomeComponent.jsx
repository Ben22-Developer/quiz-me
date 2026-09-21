import { Link } from "react-router";
import { buttonClassName } from "../../GlobalCssClassName"
import Navbar from "../navbar/NavbarComponent";
import "./home-style.css";
import { QuizPath } from "../client-route/Route";
import logo from '../quiz/hero.png';
import { useSelector } from "react-redux";
import ErrorComponent from "../error/ErrorComponent";
import { LoadComponent } from "../loader/LoadComponent";

export default function HomeComponent () 
{
    const userClientData = useSelector((state) => state.user.userClientData); 

    return GetHomeComponent(userClientData)
}

function GetHomeComponent (userClientData)
{

    return (
        <>
            <Navbar/>
            {HomeDiv (userClientData)}
        </>
    );
}

function HomeDiv (userClientData) 
{
    return (            
    
    <div className="home-div">
            
        {ProfilePicture(userClientData)}

        <p className="home-welcome-message">
            Murakaza neza {NameSpan(userClientData)} <br/><br/>
            Kuri uru rubuga, turabafasha kwitegura ibazwa rya provisoire nkuwibireye mu kizamini.
        </p>
        <Link to={QuizPath} className={buttonClassName}>Tangira Ibazwa</Link> 
        <br/><br/>
    </div>
    )
}

function ProfilePicture (userClientData)
{
    return <img src={userClientData.profilePictureUrl} className="user-profile-pic"/> 
}

function NameSpan (userClientData)
{
    if (userClientData == null)
        return <></>
    return <span>Bwana/Madamu {userClientData.name}</span>
}