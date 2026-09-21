import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getRequestByCookiesIncluded, getRequestWithAccessToken } from "../../backend-request/request/get/GetRequest";
import { LoginServerApiV1, LogoutServerApiV1,  QuizSecureTestServerApiV1,  QuizTestServerApiV1,  UserDeleteServerApiV1, UserPreviousLoginServerApiV1 } from "../../backend-request/api/ServerApi";
import { AsyncOperationFailed, AsyncOperationLoading, AsyncOperationSuccess } from "../../backend-request/AsyncStateDescription";
import postRequest, { postRequestWithAccessToken } from "../../backend-request/request/post/PostRequest";
import { deleteRequestWithAccessToken } from "../../backend-request/request/delete/DeleteRequest";
import { nullalizeUserClientData } from "./UserSlice";
import { deleteAllLocalStorageQuizMarks } from "../store/LocalStorage";
import { googleLogout } from "@react-oauth/google";

const initialState =
{
    hasLoginSession: null,

    loading: "",

    authErrorOccured: null,

    lastAccessedUnauthenticatedClientUrl: null,

    expiredAccessTokenRefreshTries: 0,

    loginErrorOccured: null,

    logoutErrorOccured: null,

    userDeleteErrorOccured: null,
}

export const hasLoginSessionCheck = createAsyncThunk(

    "/user-login-session-check",

    async (payload, thinkApi) => 
    {
        try {
            return await getRequestWithAccessToken(QuizSecureTestServerApiV1);
        } 
        catch (error) {
            return thinkApi.rejectWithValue(error.message);
        }
    }
);

export const userLogin = createAsyncThunk(

    "/user-login",

    async (payload, thinkApi) =>
    {
        try {

            return await postRequest(LoginServerApiV1, payload);
        }
        catch (error) {
            return thinkApi.rejectWithValue(error.message);
        }
    }
)

export const userLogout = createAsyncThunk(

    "/user-logout",

    async (payload, thinkApi) =>
    {
        try {
            await postRequestWithAccessToken(LogoutServerApiV1, null, payload);
            await thinkApi.dispatch(nullalizeUserClientData());
            return true;
        }
        catch (error) {
            return thinkApi.rejectWithValue(error.message);
        }
    }
)

export const userDelete = createAsyncThunk(

    "/user-delete",

    async (payload, thinkApi) =>
    {
        try {
            await deleteRequestWithAccessToken(UserDeleteServerApiV1, null);
            thinkApi.dispatch(nullalizeUserClientData());
            deleteAllLocalStorageQuizMarks();
            googleLogout();
            return true;
        }
        catch (error) {
            return thinkApi.rejectWithValue(error.message);
        }
    }
)


const authSlice = createSlice(
{
    name: "AuthSlice",
    
    initialState,

    reducers:
    {
        setLastAccessedUnauthenticatedClientUrl: (state, action) => 
        {
            state.lastAccessedUnauthenticatedClientUrl = action.payload;
        },
        setHasLogInSession: (state, action) => {
            state.hasLoginSession = action.payload;
        },
        setAccessTokenExpired: (state, action) => {
            state.accessTokenExpired = action.payload;
        },
        setAuthErrorCode: (state, action) => {
            state.errorOccured = action.payload;
        },
        nullalizeLoginOccuredError: (state) => {
            state.loginErrorOccured = null;
        },
        nullalizeLogoutOccuredError: (state) => {
            state.logoutErrorOccured = null;
        },
        nullalizeUserDeleteOccuredError: (state) => {
            state.userDeleteErrorOccured = null;
        }
    },
    extraReducers: (switchStatement) => 
    {
        switchStatement.addCase(hasLoginSessionCheck.pending, (state) => 
        {
            state.loading = AsyncOperationLoading;
            state.errorOccured = null;
        })
        .addCase(hasLoginSessionCheck.fulfilled, (state) => 
        {
            state.loading = AsyncOperationSuccess;
            state.hasLoginSession = true;
            state.errorOccured = null;
        })
        .addCase(hasLoginSessionCheck.rejected, (state, action) =>
        {
            state.errorOccured = action.payload;
            state.loading = AsyncOperationFailed;
            state.hasLoginSession = false;
        }),

        switchStatement.addCase(userLogin.pending, (state) => 
        {
            state.loading = AsyncOperationLoading;
            state.loginErrorOccured = null;
        })
        .addCase(userLogin.fulfilled, (state) => 
        {
            state.loading = AsyncOperationSuccess;
            state.userLoginProcess = false;
            state.hasLoginSession = true;
            state.loginErrorOccured = null;
        })
        .addCase(userLogin.rejected, (state, action) => 
        {
            state.loading = AsyncOperationFailed;
            state.userLoginProcess = false;
            state.loginErrorOccured = action.payload;
        }),

        switchStatement.addCase(userLogout.pending, (state) => 
        {
            state.loading = AsyncOperationLoading;
            state.logoutErrorOccured = null;
        })
        .addCase(userLogout.fulfilled, (state) => 
        {
            state.hasLoginSession = false;
            state.loading = AsyncOperationLoading;
            state.logoutErrorOccured = null;
        })
        .addCase(userLogout.rejected, (state, action) => 
        {
            state.loading = AsyncOperationFailed;
            state.logoutErrorOccured = action.payload;
        }),

        switchStatement.addCase(userDelete.pending, (state) => 
        {
            state.loading = AsyncOperationLoading;
            state.userDeleteErrorOccured = null;
        })
        .addCase(userDelete.fulfilled, (state) => 
        {
            state.hasLoginSession = false;
            state.loading = AsyncOperationLoading;
            state.userDeleteErrorOccured = null;
        })
        .addCase(userDelete.rejected, (state, action) => 
        {
            state.loading = AsyncOperationFailed;
            state.userDeleteErrorOccured = action.payload;
        })
    }
});

export const { setLastAccessedUnauthenticatedClientUrl, setHasLogInSession, setAccessTokenExpired, setAuthErrorCode, nullalizeLoginOccuredError, nullalizeLogoutOccuredError, nullalizeUserDeleteOccuredError } = authSlice.actions;

export const authSliceReducer = authSlice.reducer;