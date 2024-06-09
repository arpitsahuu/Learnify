import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./Slices/UserSlice";


export const Store = configureStore({
    reducer: { 
        user: UserSlice,
        // employe: EmployeSlice
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof Store.getState>;
// Inferred type: {student: StudentState, employe: EmployeState}
export type AppDispatch = typeof Store.dispatch;
