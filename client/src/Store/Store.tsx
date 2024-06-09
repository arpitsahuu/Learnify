import { configureStore } from "@reduxjs/toolkit";


export const Store = configureStore({
    reducer: { 
        // student: StudentSlice,
        // employe: EmployeSlice
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof Store.getState>;
// Inferred type: {student: StudentState, employe: EmployeState}
export type AppDispatch = typeof Store.dispatch;
