export const localStoreKey = "QuizMe";

const lastQuizMarks = "lastQuizMarks";

export function loadLocalStorageLastQuizMarks (googleId)
{

    const localStorage = window.localStorage;

    const loadedMarksDb = (localStorage[lastQuizMarks] == null) ? null : JSON.parse(localStorage[lastQuizMarks]);

    if (loadedMarksDb == null)
        return null;

    const lastQuizMarksArray = loadedMarksDb[googleId];

    return lastQuizMarksArray == null ? [] : lastQuizMarksArray;
}

export function addNewLastQuizMark (lastQuizMarksArray, lastQuizMark)
{
    if (lastQuizMarksArray.length >= 5) {
        deleteLocalStorageQuizMarksByIndex (lastQuizMarksArray, 0);
    }

    lastQuizMarksArray.push(lastQuizMark);
}

export function deleteLocalStorageQuizMarksByIndex (lastQuizMarksArray, index) {
    lastQuizMarksArray.splice(index, 1);
}

export function deleteAllLocalStorageQuizMarks (googleId) {
    const lastQuizMarksArray = loadLocalStorageLastQuizMarks (googleId);
    lastQuizMarksArray.splice(0, lastQuizMarksArray.length);
    storeLastQuizMarks (lastQuizMarksArray, googleId);
}


export function storeLastQuizMarks (lastQuizMarksArray, googleId)
{
    const localStorage = window.localStorage;

    const db = (localStorage[lastQuizMarks] == null) ? { [googleId] : [] } : JSON.parse(localStorage[lastQuizMarks]);

    db[googleId] = lastQuizMarksArray;

    userDbUpdate(db, googleId);
    dbUpdate(localStorage, db);
}


function userDbUpdate (db, googleId)
{
    if (db[googleId].length === 0)
        delete db[googleId];
}

function dbUpdate (localStorage, db)
{
    if (Object.keys(db).length === 0) 
        localStorage.clear();

    else
        localStorage.setItem(lastQuizMarks, JSON.stringify(db)); 
}
