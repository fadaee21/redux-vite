import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
const USERS_URL = "https://jsonplaceholder.typicode.com/users";
type Users = {
  id: string;
  name: string;
};
const initialState: Users[] = [];
export const fetchUsers = createAsyncThunk("user/fetch", async () => {
  try {
    const response = await axios.get(USERS_URL);
    return [...response.data];
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error.message;
    } else {
      return error;
    }
  }
});
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchUsers.fulfilled,
      (_state, action: PayloadAction<any>) => {
        // state.push(action.payload);
        return action.payload;
      }
    );
  },
});
export default usersSlice.reducer;
export const selectAllUsers = (state: RootState) => state.users11;
