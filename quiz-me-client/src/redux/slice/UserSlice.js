import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getRequestWithAccessToken } from "../../backend-request/request/get/GetRequest"
import { UserClientDataServerApiV1 } from "../../backend-request/api/ServerApi"
import { AsyncOperationFailed, AsyncOperationLoading, AsyncOperationSuccess } from "../../backend-request/AsyncStateDescription"

const initialState =
{
    userClientData: null,

    loading: null,

    errorOccured: null,
}

export const userClientDataFetch = createAsyncThunk(
    "/user-client-field",
    async (payload, thunkApi) => 
    {
        try {
            return await getRequestWithAccessToken(UserClientDataServerApiV1);
        } 
        catch (error) {
            return thunkApi.rejectWithValue(error.message);
        }
    }
);


const userSlice = createSlice(
{
    name: "userSlice",

    initialState,

    reducers: {
        nullalizeUserClientData: (state) => 
        {
            state.userClientData = null;
        }
    },

    extraReducers: (switchStatement) => 
    {
        switchStatement.addCase(userClientDataFetch.pending, (state) => 
        {
            state.loading = AsyncOperationLoading;
            state.errorOccured = null; 
        })
        .addCase(userClientDataFetch.fulfilled, (state, action) => 
        {
            state.loading = AsyncOperationSuccess;
            state.userClientData = action.payload;
            state.errorOccured = null;
        })
        .addCase(userClientDataFetch.rejected, (state, action) => 
        {
            state.loading = AsyncOperationFailed;
            state.errorOccured = action.payload;
        })

    }
});

export const { nullalizeUserClientData } = userSlice.actions;

export const userSliceReducer = userSlice.reducer;