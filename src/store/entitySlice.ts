import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface MyKnownError {
  errorMessage: string
  
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
// Define a type for the slice state
interface EntityState {
  value: {
    id: number;
    rowName: string;
  };
  status: string|null;
  error: string|null|any;
}

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
    increment: (state) => {
      state.value.id += 1;
    },
    decrement: (state) => {
      state.value.id -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value.id += action.payload;
    },
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

export const { increment, decrement, incrementByAmount } = entitySlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectEntity = (state: RootState) => state.entity.value.id;

export default entitySlice.reducer;
