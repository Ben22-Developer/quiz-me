import { configureStore } from "@reduxjs/toolkit";
import { quizSliceReducer } from "../slice/QuizSlice";
import { authSliceReducer } from "../slice/AuthSlice";
import { userSliceReducer } from "../slice/UserSlice";

const AppStore = configureStore({
    reducer: {
        quiz: quizSliceReducer,
        auth: authSliceReducer,
        user: userSliceReducer,
    }
});

export default AppStore;