import React, { useState } from 'react'
import Navbar from '../navbar/NavbarComponent'
import { useDispatch, useSelector } from 'react-redux';
import { AsyncOperationLoading } from '../../backend-request/AsyncStateDescription';
import HomeComponent from '../home/HomeComponent';
import { LoadComponent } from '../loader/LoadComponent';
import "./marks-style.css";
import { addNewLastQuizMark, deleteLocalStorageQuizMarksByIndex, loadLocalStorageLastQuizMarks, storeLastQuizMarks } from '../../redux/store/LocalStorage';
import { nullalizeQuizResult } from '../../redux/slice/QuizSlice';
import { buttonClassName } from '../../GlobalCssClassName';
import ErrorComponent from '../error/ErrorComponent';

export default function MarksComponent(props) {

  const quizResult = useSelector((state) => state.quiz.quizResult);

  const isFetchingQuizResultAfterSubmit = useSelector((state) => state.quiz.isFetchingQuizResultAfterSubmit);

  const asyncErrorMessage = useSelector((state) => state.quiz.asyncErrorMessage);

  const userErrorMessage = useSelector((state) => state.user.errorOccured);

  const userClientData = useSelector((state) => state.user.userClientData);

  const localStorageQuizMarksArray = handleQuizResult (quizResult, userClientData?.googleId);

  return (
    <div key={crypto.randomUUID()}>
      { userClientData === null ? <></> : NavbarDisplay(props) }
      <div className="container">
          {getComponentToDisplay (isFetchingQuizResultAfterSubmit, userErrorMessage, asyncErrorMessage, localStorageQuizMarksArray, userClientData) }
      </div>
    </div>
  )
}

function NavbarDisplay (props)
{
  return props?.DontShowNavbar ? <></> : <Navbar/>
}

function getComponentToDisplay (isFetchingQuizResultAfterSubmit, userErrorMessage, asyncErrorMessage, localStorageQuizMarksArray, userClientData) 
{
    if (asyncErrorMessage !== null)
        return <ErrorComponent error={asyncErrorMessage}/>

    if (userErrorMessage != null)
        return <ErrorComponent error={userErrorMessage}/>

    if (isFetchingQuizResultAfterSubmit || userClientData == null) {
        return <LoadComponent />
    }
    
    return <>
      <h3>
        <u>Amanota mwagize mu bizamini 5 bishize</u>
      </h3>
      <QuizResultCardContainer localStorageQuizMarksArray={localStorageQuizMarksArray} userGoogleId={userClientData.googleId}/>
    </>
}

function QuizResultCardContainer (props)
{

  const [reload, setReload] = useState(true);

  return (
  <>
    {getQuizResultCards(props.localStorageQuizMarksArray, setReload, reload, props.userGoogleId)}
  </>
  )
}

function getQuizResultCards (localStorageQuizMarksArray, setReload, reload, googleId)
{

  if (localStorageQuizMarksArray == null || localStorageQuizMarksArray.length === 0)
    return <p>Nt'amanota mufite kuko mutarakora byibura ikizamini kimwe.</p>

  const uiArray = [];

  let fromLatest = 0;

  for (let i = localStorageQuizMarksArray.length-1; i >= 0; i--) {
    uiArray.push(ResultCard (fromLatest,localStorageQuizMarksArray, localStorageQuizMarksArray[i], i, setReload, reload, googleId));
    fromLatest += 1;
  }

  return uiArray;

}

function ResultCard (fromLatest, localStorageQuizMarksArray, localStorageQuizMarks, index, setReload, reload, googleId)
{
  const date = new Date(localStorageQuizMarks.doneOn);

  const day = date.getDate() < 10 ? "0"+date.getDate() : date.getDate();

  const month = (date.getMonth() + 1) < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;

  const year = date.getFullYear();

  const hour = date.getHours() < 10 ? "0"+date.getHours() : date.getHours();

  const minute = date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes();

  const seconds = date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds();


  return (
      <div className="card" key={index}>
        <p className="index">{fromLatest+1}</p>
        {Icon(localStorageQuizMarks.average)}
        {Title(localStorageQuizMarks.average)}
        <p>
          <b>Amanota:</b> {localStorageQuizMarks.userMarks}/{localStorageQuizMarks.totalMarks}
        </p>
        <p>
          <b>Kw'ijana:</b> {localStorageQuizMarks.average.toFixed(2)}%
        </p>
        <p>
          <b>Itariki ibazwa ryakozwe: </b>
          {day}/{month}/{year}
        </p>
        <p>
          <b>Isaha ryakoreweho: </b> {hour}:{minute}:{seconds}
        </p>
        <button className="button delete" 
          onClick={() => {
            removeMarksFromLocalStorage(localStorageQuizMarksArray, index); 
            storeLastQuizMarksToLocalStorage(localStorageQuizMarksArray, googleId); 
            setReload(!reload); 
          }}>
            Siba
        </button>
      </div>
  )
}


function Icon (average) 
{
  if (average <= 60) 
    return <div className="icon">😢</div>
  
  else if (average > 60 && average < 80)
    return <div className="icon">😏</div>
  
  return <div className="icon">&#127881;</div>
}



function Title (average) 
{
  if (average <= 60) 
    return <h1 className="centered-text">Wakoze nabi</h1>
  
  else if (average > 60 && average < 80)
    return <h1 className="centered-text">Wakoze neza</h1>
  
  return <h1 className="centered-text">Wakoze neza cyane rwose</h1>

}

function handleQuizResult (quizResult, googleId) 
{

    const localStorageQuizMarksArray = loadLocalStorageQuizMarksArray (googleId, true);

    // in order to store a new `quizResult`: - I check if it's n't null example: when a user clicks 'Amanota' from 'Ahabanza', while he initially visits the page. The quizResult is null

    // - I check if localStorageQuizMarksArray.length is 0 and quizResult isn't equal to null hence I know this is a fresh new item to insert in the array.

    // - I check if the last item in the store in't equal to `quizResult`, example he may have examined before but he doesn't close the page or re-examine himself, 
    // hence I check if it isn't the lastly result coming up again. By using `doneOn`

    if (quizResult !== null && (localStorageQuizMarksArray.length === 0 ||  localStorageQuizMarksArray[localStorageQuizMarksArray.length-1]["doneOn"] !== quizResult["doneOn"])) 
    {
      addLastQuizMarksInLocalStorage(localStorageQuizMarksArray, quizResult);
      storeLastQuizMarksToLocalStorage(localStorageQuizMarksArray, googleId);
    }
    return localStorageQuizMarksArray;
}

function loadLocalStorageQuizMarksArray (googleId, ...handleNullability) {
  
  const loadLocalStorageLastQuizMarksArray = loadLocalStorageLastQuizMarks(googleId);

  if (handleNullability.length === 0)
    return loadLocalStorageLastQuizMarksArray;
  else 
    return (loadLocalStorageLastQuizMarksArray === null) ? [] : loadLocalStorageLastQuizMarksArray;
}

function addLastQuizMarksInLocalStorage (lastQuizMarksArray, quizResult){
  addNewLastQuizMark(lastQuizMarksArray, quizResult);
}

function removeMarksFromLocalStorage (lastQuizMarksArray, index){
  deleteLocalStorageQuizMarksByIndex(lastQuizMarksArray, index);
}

function storeLastQuizMarksToLocalStorage (lastQuizMarksArray, googleId){
  storeLastQuizMarks(lastQuizMarksArray, googleId);
}
