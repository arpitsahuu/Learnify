import axios from "../../../axiosconfig";
import { IsLoading, SetUser, RemoveUser } from "../Slices/UserSlice";
import { Dispatch } from "redux";

interface User {
  id: string;
  name: string;
  email: string;
  contact: String;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  gender: string;
  courses: Array<{ courseId: string }>;
}

interface Internship {
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

interface AppState {
  student: StudentState;
}

// Action creators
export const asyncCurrentUser =
  () => (dispatch: Dispatch, getState: () => AppState) => {
    // Add your implementation here if needed
    return {
      type: "ASYNC_CURRENT_USER",
      // Add other properties as needed
    };
  };

export const asyncSignup = (user: User) => async (dispatch: Dispatch, getState: () => AppState) => {
    try {
      const res = await axios.post("/user/student/signup", user);
    } catch (error) {
      console.log(error);
    }
};

interface signinData {
    email: string;
    password:string;
}

export const asyncSignin = (data: signinData) => async (dispatch: Dispatch, getState: () => AppState) => {
    try {
      const res = await axios.post("/user/student/signup", data);
      dispatch(SetUser(res.data.student));
    } catch (error) {
      console.log(error);
    }
};