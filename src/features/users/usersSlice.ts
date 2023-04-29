import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type Users = {
  id: string;
  name: string;
};

const initialState: Users[] = [
  { id: "0", name: "Dude Lebowski" },
  { id: "1", name: "neil Young" },
  { id: "2", name: "Dave Gray" },
];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
});

export default usersSlice.reducer;

export const selectAllUsers = (state: RootState) => state.users11;
