import {
  PayloadAction,
  createSlice,
  nanoid,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { sub } from "date-fns";
import axios from "axios";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

interface Reactions {
  [key: string]: number;
}
export interface Post1 {
  userId: string | number;
  title: string;
  body: string;
}
export interface Post extends Post1 {
  id: string;
  date: string;
  reactions: Reactions;
}
type DeleteProp = { id: string } | string | false;

export type Status = "idle" | "loading" | "succeed" | "failed";
// const initialState: Post[] = [
//   {
//     id: "1",
//     title: "Learn JavaScript (6 months)",
//     content: "CodeGeeX",
//     date: sub(new Date(), { minutes: 10 }).toISOString(),
//     reactions: {
//       thumbsUp: 0,
//       wow: 0,
//       heart: 0,
//       rocket: 0,
//       coffee: 0,
//     },
//   },
//   {
//     id: "2",
//     title: "Learn with me (6 months)",
//     content: "CodeGeeX",
//     date: sub(new Date(), { minutes: 5 }).toISOString(),
//     reactions: {
//       thumbsUp: 0,
//       wow: 0,
//       heart: 0,
//       rocket: 0,
//       coffee: 0,
//     },
//   },
// ];
export interface PostState {
  post: Post[];
  status: Status;
  error: string | undefined;
}
export const selectPostById = (state: RootState, postId: string) => {
  return state.posts.post.find((post) => post.id == postId);
};

const initialState: PostState = {
  post: [],
  status: "idle",
  error: undefined,
};

export const fetchPosts = createAsyncThunk("post/fetchPost", async () => {
  try {
    const response = await axios.get(POSTS_URL);
    return [...response.data];
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error.message;
    } else {
      return error;
    }
  }
});
export const addPostNew = createAsyncThunk(
  "post/addPostNew",
  async (postVal: Post1) => {
    console.log(postVal, "createasyncthunk");
    try {
      const response = await axios.post(POSTS_URL, postVal);
      return response.data; //it has just one record
    } catch (error: unknown) {
      if (error instanceof Error) {
        return error.message;
      } else {
        return error;
      }
    }
  }
);
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (initialPost: Partial<Post>) => {
    const { id } = initialPost;
    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
      return response.data;
    } catch (err) {
      // return err.message;
      return initialPost; // only for testing Redux!
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (val: DeleteProp) => {
    if (typeof val === "object" && val !== null && "id" in val) {
      const id = val.id;
      try {
        const response = await axios.delete(`${POSTS_URL}/${id}`);
        if (response?.status === 200) return val;
        return `${response?.status}: ${response?.statusText}`;
      } catch (err: unknown) {
        return err instanceof Error && err.message;
      }
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action: PayloadAction<Post, string>) {
        state.post.push(action.payload);
      },
      prepare(title: string, body: string, userId: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            body,
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
    }, //at the end it will replace with addPostNew

    reactionAdded(
      state,
      action: PayloadAction<{ reaction: string; postId: string }, string>
    ) {
      const { postId, reaction } = action.payload;
      const existingPost = state.post.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeed";
        //adding date and reaction
        let min = 1;
        const loadedPosts: Post[] = action.payload.map((post: Post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        });
        state.post = loadedPosts;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addPostNew.fulfilled, (state, action) => {
        // Fix for API post IDs:(this api only return id:101)
        // Creating sortedPosts & assigning the id
        // would be not be needed if the fake API
        // returned accurate new post IDs
        const sortedPosts = state.post.sort((a, b) => {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
          return 0;
        });
        action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
        // End fix for fake API post IDs

        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          hooray: 0,
          heart: 0,
          rocket: 0,
          eyes: 0,
        };
        console.log(action.payload);
        state.post.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }

        const { id } = action.payload;
        action.payload.date = new Date().toISOString();
        const posts = state.post.filter((post) => post.id !== id);
        state.post = [...posts, action.payload];
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<any>) => {
        const id = action.payload?.id;
        if (!id) {
          console.log("Delete could not complete");
          console.log(action.payload);
          return;
        }

        const posts = state.post.filter((post) => post.id !== id);
        state.post = posts;
      });
  },
});

export default postSlice.reducer;
export const selectPosts = (state: RootState) => state.posts.post;
export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;
export const { postAdded, reactionAdded } = postSlice.actions;
