import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Todo } from "../../type";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  tagTypes: ["Todos88"],
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => "/todos",
      providesTags: ["Todos88"],
    }),
    addTodo: builder.mutation({
      query: (todo: Todo) => ({
        url: "/todos",
        body: todo,
        method: "POST",
      }),
      invalidatesTags: ["Todos88"],
    }),
    updateTodo: builder.mutation({
      query: (todo: Todo) => ({
        url: `/todos/${todo.id}`,
        body: todo,
        method: "PATCH",
      }),
      invalidatesTags: ["Todos88"],
    }),
    deleteTodo: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todos88"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = apiSlice;
