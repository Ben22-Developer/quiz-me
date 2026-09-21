import "./error-component-style.css";

export default function ErrorComponent (props)
{
    return (
        <>
            <div className="container">
                <p>{props.error}</p>
                {props.errorHandler != null ? <button className="button error-handler" onClick={props.errorHandler}>
                    {props.buttonText != null ? props.buttonText : "Retry"}
                </button> : <></>} 
            </div>
        </>
    )
}