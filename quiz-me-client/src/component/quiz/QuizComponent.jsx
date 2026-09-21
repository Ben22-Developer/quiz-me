import React, { useEffect, useRef, useState } from 'react';

import "./quiz-style.css";
import { useDispatch, useSelector } from 'react-redux';
import { decrementCurrentDisplayingQuestionIndex, incrementCurrentDisplayingQuestionIndex, requestQuiz, submitQuiz, userAnswer } from "../../redux/slice/QuizSlice";
import logo from '../../assets/hero.png';
import { LoadComponent } from '../loader/LoadComponent';
import { AsyncOperationFailed, AsyncOperationLoading } from '../../backend-request/AsyncStateDescription';
import { MarksPath } from '../client-route/Route';
import { useNavigate } from 'react-router';
import ErrorComponent from '../error/ErrorComponent';


function QuizTimeCounter () 
{

    const answersMap = useSelector((state) => state.quiz.answersMap);
    const totalMarks = useSelector((state) => state.quiz.totalQuizQuestions);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(1);

    const timeUp = minutes == 0 && seconds == 0;

    useEffect(() => 
    {
        if (timeUp) 
        {
            quizSubmit(answersMap, totalMarks, dispatch, navigate);
            alert("Igihe kirabafashe!\nKanda 'Ok' ubundi ubone amanota wari ugejejeho.");
            return;
        }

        const interval = setInterval(() => 
        {
            if (seconds === 0) {
                setMinutes(minutes-1);
                setSeconds(59);
            } 
            else {
                setSeconds( seconds-1);
            }

        }, 1000);

        return () => clearInterval(interval);

    }, [seconds]);

    return (
        <div className="counter">
            <p>Remaining Time</p>
            <p><span>{minutes < 10 ? "0"+minutes : minutes}</span> : <span>{seconds < 10 ? "0"+seconds : seconds}</span></p>
        </div>
    )
}

function Question() {

 const quizQuestionArray =  useSelector((state) => state.quiz.quizQuestionArray);

 const currentDisplayingQuestionIndex = useSelector((state) => state.quiz.currentDisplayingQuestionIndex);

 const currentDisplayingQuestion = quizQuestionArray[currentDisplayingQuestionIndex];

 const userAnswerId = useSelector((state) => state.quiz.answersMap[currentDisplayingQuestion?.id]);

 const dispatch = useDispatch();

 function userChoice (payload) {
        dispatch(userAnswer(payload));
 }

 if (quizQuestionArray.length == 0) {
    return <LoadComponent />;
 }

  return (
        <div className="card-list">
            <div className="card-item">
                <h3 className="question-text">{quizQuestionArray[currentDisplayingQuestionIndex].content}</h3>

{/* to be added when the images are included too */}
                {/* <div className="imageContainer">
                    <img src={logo} alt="Card Image"/> 
                </div> */}
                
                <div>
                    {answersRadioButtonPopulate(quizQuestionArray[currentDisplayingQuestionIndex], userChoice, userAnswerId)}
                </div>
            </div>
        </div>        
  )
}

function answersRadioButtonPopulate (quizQuestion, userChoice, userAnswerId)
{
    

    const answers = quizQuestion.answers;
    const questionId = quizQuestion.id;

    const answersUI = [];


    for (const answer of answers) {
        answersUI.push(Answer(answer, questionId, userChoice, userAnswerId));
    }
    return answersUI;
}

function Answer (answer, questionId, userChoice, userAnswerId) 
{
    const isChecked = userAnswerId != null && (userAnswerId === answer.id);

    return (
        <label key={answer.id}>
            {
                isChecked ?
                <input type="radio" name="answer" value={answer.id} onClick={() => userChoice({questionId: questionId, answerId: answer.id})} defaultChecked/> :
                <input type="radio" name="answer" value={answer.id} onClick={() => userChoice({questionId: questionId, answerId: answer.id})} />}
            {answer.content}
        </label>
    );
}

function QuizControllerButtons () {

    const currentDisplayingQuestionIndex = useSelector((state) => state.quiz.currentDisplayingQuestionIndex);

    const lastQuizQuestionIndex = useSelector((state) => state.quiz.totalQuizQuestions - 1);
    
    const dispatch = useDispatch();

    function nextQuestion () {
        dispatch(incrementCurrentDisplayingQuestionIndex());
    }

    function previousQuestion () {
        dispatch(decrementCurrentDisplayingQuestionIndex());
    }

    return (
        <div className="quizControllerButtonsDiv">
            
            {currentDisplayingQuestionIndex === 0 ? <></> :
            <button className="button quizButton" onClick={previousQuestion}>
                Ikibazo<br/>Kibanziriza
            </button>}

            {currentDisplayingQuestionIndex === lastQuizQuestionIndex ? <></> : 
            <button className="button quizButton" onClick={nextQuestion}>
                Ikibazo<br/>Gikurikira
            </button>}
        </div>
    )
}

function SubmitQuizButton () {


    const answersMap = useSelector((state) => state.quiz.answersMap);
    const totalMarks = useSelector((state) => state.quiz.totalQuizQuestions);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
            (Object.keys(answersMap).length === 0) ? <></> :
            <button className="button submit-quiz-button" onClick={() => quizSubmit(answersMap, totalMarks, dispatch, navigate)}>
                Kosorwa
            </button>
    );
}

function quizSubmit (answersMap, totalMarks, dispatch, navigate) {

    // dispatch(setAsyncStateToLoading());
    dispatch(submitQuiz({ questionIdToAnswerIdDictionary: {...answersMap}, totalMarks: totalMarks }));
    navigate(MarksPath);
}

export default function QuizComponent ()
{   
    const dispatch = useDispatch();

    const isFetchingQuiz = useSelector((state) => state.quiz.isFetchingQuiz);

    const asyncErrorMessage = useSelector((state) => state.quiz.asyncErrorMessage);

    const [load, setLoad] = useState(false);

    useEffect(() =>
    {

        const method = dispatch(requestQuiz());

        return () => method;
        
    },[dispatch, load]);

    return (
                <div className="quizComponentBody">
                    {getComponentToDisplay(isFetchingQuiz, asyncErrorMessage, setLoad, load )}
                </div>
            );
}


function getComponentToDisplay (isFetchingQuiz, asyncErrorMessage, setLoad, load) 
{
    if (isFetchingQuiz)
        return <LoadComponent />
    
    if (asyncErrorMessage !== null)
        return <ErrorComponent error={asyncErrorMessage}/>

    return (
        <>
            <div className="quizTimeCounter_QuestionDiv">
                <QuizTimeCounter/>
                <Question />
            </div>

            <QuizControllerButtons />
            <SubmitQuizButton/>
        </>
    )    
}

