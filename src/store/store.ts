import { configureStore } from '@reduxjs/toolkit'
import entitySlice from './entitySlice'
import lineSlice from './lineSlice'
// ...

export const store = configureStore({
  reducer: {
    lines: lineSlice,
    entity: entitySlice

  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch