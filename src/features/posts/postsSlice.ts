import { PayloadAction, createSlice, nanoid } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { sub } from "date-fns";

interface Reactions {
  [key: string]: number;
}
export interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
  reactions: Reactions;
}
const initialState: Post[] = [
  {
    id: "1",
    title: "Learn JavaScript (6 months)",
    content: "CodeGeeX",
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: {
      thumbsUp: 0,
      wow: 0,
      heart: 0,
      rocket: 0,
      coffee: 0,
    },
  },
  {
    id: "2",
    title: "Learn with me (6 months)",
    content: "CodeGeeX",
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: {
      thumbsUp: 0,
      wow: 0,
      heart: 0,
      rocket: 0,
      coffee: 0,
    },
  },
];

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action: PayloadAction<Post, string>) {
        state.push(action.payload);
      },
      prepare(title: string, content: string, userId: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            userId,
            date: new Date().toISOString(),
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          },
        };
      },
    },

    postRemoved(state, action) {
      const id = action.payload;
      const ind = state.findIndex((post) => post.id === id);
      state.splice(ind, 1);
    },

    reactionAdded(
      state,
      action: PayloadAction<{ reaction: string; postId: string }, string>
    ) {
      const { postId, reaction } = action.payload;
      const existingPost = state.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
});

export default postSlice.reducer;
export const selectPosts = (state: RootState) => state.posts;
export const { postAdded, reactionAdded, postRemoved } = postSlice.actions;
