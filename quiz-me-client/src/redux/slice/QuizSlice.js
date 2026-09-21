import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { QuizRequestServerApiV1, QuizSumbitServerApiV1 } from "../../backend-request/api/ServerApi";
import getRequest, { getRequestWithAccessToken } from "../../backend-request/request/get/GetRequest";
import { AsyncOperationFailed, AsyncOperationLoading, AsyncOperationSuccess } from "../../backend-request/AsyncStateDescription";
import postRequest, { postRequestWithAccessToken } from "../../backend-request/request/post/PostRequest";
import { unauthenticatedExceptionCode } from "../../component/error/SpecialErrorCode";

export const submitQuizAsyncThunkUrl = "submit/quiz";

const initialState = 
{
    quizQuestionArray: [],

    answersMap: {},

    chunk: { skip: 1, take: 1, }, 

    asyncState: null,

    asyncErrorMessage: null,

    quizQuestionGivenAt: null,

    currentDisplayingQuestionIndex: -1,

    totalQuizQuestions: -1,

    quizResult: null,

    isFetchingQuizResultAfterSubmit: false,

    isFetchingQuiz: false, 

};

export const requestQuiz = createAsyncThunk(
    "request/quiz",
    async (payload, thinkAPI) => 
    {
        try {
            return await getRequestWithAccessToken(QuizRequestServerApiV1);
        }
        catch (error){
            return thinkAPI.rejectWithValue(error.message);
        }
    }
);

export const submitQuiz = createAsyncThunk(
    
    submitQuizAsyncThunkUrl,

    async ({ questionIdToAnswerIdDictionary, totalMarks}, thunkApi) => 
    { 
        const payload = {questionIdToAnswerIdDictionary, totalMarks};

        try {
            return await postRequestWithAccessToken(QuizSumbitServerApiV1, payload);
        }
        catch (error)
        {
            return thunkApi.rejectWithValue(error.message);
        }
    }
)

const quizSlice = createSlice({
    
    name: "quizSliceStateState",
    initialState,
    
    reducers: {
        decrementCurrentDisplayingQuestionIndex: (state) => 
        {
            state.currentDisplayingQuestionIndex = (state.currentDisplayingQuestionIndex <= 0) ? 
            0 : state.currentDisplayingQuestionIndex -= 1;
        },
        incrementCurrentDisplayingQuestionIndex: (state) => 
        {
            state.currentDisplayingQuestionIndex = (state.currentDisplayingQuestionIndex >= state.quizQuestionArray.length-1) ? 
            state.quizQuestionArray.length-1 : state.currentDisplayingQuestionIndex += 1;
        },
        userAnswer: (state, action) =>
        {
            populateUserAnswer (state, action.payload);
        },
        nullalizeQuizResult: (state) => 
        {
            state.quizResult = null;
        },
    },

    extraReducers: (switchStatement) =>
    {
        switchStatement.addCase(requestQuiz.pending, (state) => {
            state.asyncState = AsyncOperationLoading;
            state.isFetchingQuiz = true;
            state.asyncErrorMessage = null;
        })
        .addCase(requestQuiz.rejected, (state, action) => {
            state.asyncState = AsyncOperationFailed;
            state.asyncErrorMessage = action.payload;
            state.isFetchingQuiz = false;
        })
        .addCase(requestQuiz.fulfilled, (state, action) => {
            state.asyncState = AsyncOperationSuccess;
            state.asyncErrorMessage = null;
            setQuizRequestDtoResponse (state, action.payload);
            state.isFetchingQuiz = false;
        }),

        switchStatement.addCase(submitQuiz.pending, (state) => {
            state.asyncState = AsyncOperationLoading;
            state.isFetchingQuizResultAfterSubmit = true;
            state.asyncErrorMessage = null;
        })
        .addCase(submitQuiz.rejected, (state, action) => {
            state.asyncState = AsyncOperationFailed;
            state.asyncErrorMessage = action.payload;
            state.isFetchingQuizResultAfterSubmit = false;
        })
        .addCase(submitQuiz.fulfilled, (state, action) => {
            state.asyncState = AsyncOperationSuccess;
            state.asyncErrorMessage = null;
            state.quizResult = action.payload;

            state.answersMap = {};
            state.isFetchingQuizResultAfterSubmit = false;
        });
    },
});

function setQuizRequestDtoResponse (state, response)
{
    state.quizQuestionArray.splice(0, state.quizQuestionArray.length);
    
    response.quizQuestion.forEach(e => state.quizQuestionArray.push(e));

    state.chunk.skip = response.nextChunk.skip;
    state.chunk.take = response.nextChunk.take;
    state.quizQuestionGivenAt = response.doneOn;
    state.currentDisplayingQuestionIndex = 0;
    state.totalQuizQuestions = state.quizQuestionArray.length;
}

function populateUserAnswer (state, payload)
{

    const questionId = payload.questionId;
    const answerId = payload.answerId;
    state.answersMap[questionId] = answerId;

    // console.log(current(state.answersMap));
}


export const 
{ 
    quizRequest, incrementCurrentDisplayingQuestionIndex, decrementCurrentDisplayingQuestionIndex, userAnswer, nullalizeQuizResult,
    setUnauthorizedFailedOnSubmitQuizResults, setUnauthorizedFailedRequestServerApi, setFailedUnauthorizedThunkAsyncUrlOnQuizSlice
} = quizSlice.actions;

export const quizSliceReducer = quizSlice.reducer;