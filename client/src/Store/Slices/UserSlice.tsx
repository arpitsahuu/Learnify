import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for your state
interface User {
  id: string;
  name: string;
  email: string;
  contact:String;
  avatar:{
    public_id: string,
    url:string
  };
  role: string;
  isVerified: boolean;
  gender:string;
  courses:Array<{courseId: string}>;
}

interface Internship {
  id: string;
  title: string;
  // Add other fields as necessary
}

interface Job {
  id: string;
  title: string;
  // Add other fields as necessary
}

interface StudentState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  courses: Internship[] | null;
  error: string | null;
}

// Define the initial state using the StudentState interface
const initialState: StudentState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
  courses: null,
  error: null,
};

export const UserSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    IsLoading: (state) => {
      state.isLoading = true;
    },
    SetUser: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    },
    RemoveUser: (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },

  },
});

export const { SetUser, RemoveUser, IsLoading} = UserSlice.actions;

export default UserSlice.reducer;
