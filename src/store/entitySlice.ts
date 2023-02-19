import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface MyKnownError {
  errorMessage: string 
}
// Define a type for the slice state
export interface EntityState {
  value: {
    id: number;
    rowName: string;
  };
  status: string|null;
  error: string|null|any;
}

export const fetchEntity = createAsyncThunk(
  "entity/fetchEntity",
  async function (_, {rejectWithValue}) {
    try {
      const resp = await fetch(
        "http://185.244.172.108:8081/v1/outlay-rows/entity/create",
        {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
     
      if(!resp.ok){
        throw new Error('Server error')
      }
      const data = await resp.json();
      return data;
    } catch (error:any) {
      return rejectWithValue(error.message)
    }
   
  }
);


// Define the initial state using that type
const initialState: EntityState = {
  value: { id: 0, rowName: '' },
  status: null,
  error: null
};

export const entitySlice = createSlice({
  name: "entity",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEntity.fulfilled, (state, action) => {
        state.status = "finished";
        state.value = action.payload;
      })
      .addCase(fetchEntity.rejected, (state, action) => {
        state.status = "failed";
        state.error =  action.payload
      });
  },
});



// Other code such as selectors can use the imported `RootState` type
export const selectEntity = (state: RootState) => state.entity.value.id;

export default entitySlice.reducer;
