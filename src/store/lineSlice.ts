import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { firstItem } from "../components/TableItem/TableItem.service";
import type { RootState } from "./store";
import { ILine } from "../components/TableItem/TableItem.type";
import { updateData, findObj } from "./lineSlice.service";
import { EntityState } from "./entitySlice";

//1:
export const fetchLines = createAsyncThunk<
  ILine[],
  undefined,
  { rejectValue: string; state: { lines: LineState; entity: EntityState } }
>(
  "line/fetchLines",
  async function (_, { rejectWithValue, getState}) {
    const { entity } = getState()
    const resp = await fetch(
      `http://185.244.172.108:8081/v1/outlay-rows/entity/50088/row/list`,
      {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (!resp.ok) {
      return rejectWithValue("Server error");
    }
    const data = await resp.json();
    if (!data.length) {
      data.push(firstItem.current);
      return data;
    }
    updateData(data);
    return data;
  }
);
export const createLine = createAsyncThunk<
  ILine,
  ILine,
  { rejectValue: string; state: { lines: LineState; entity: EntityState } }
>(
  "line/createLine",
  async function (newLine: ILine, { rejectWithValue, getState, dispatch }) {
    const { entity } = getState()

    const resp = await fetch(
      `http://185.244.172.108:8081/v1/outlay-rows/entity/50088/row/create`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLine),
      }
    );
    if (!resp.ok) {
      return rejectWithValue("Can't add new line");
    }
    const data = await resp.json();
  
    if (data.changed.length) {
      dispatch(setChildForLine(data));
      dispatch(
        setLevel({
          ...data.current,
          id: data.current.id,
          level: data.changed.length,
        })
      );
      data.changed.map((item: ILine) => dispatch(updateLine(item)));
    } else {
      dispatch(addLine(data.current));
      dispatch(setLevel({ ...data.current, id: data.current.id, level: 0 }));
    }

    return data;
  }
);
export const deleteLine = createAsyncThunk<
ILine[],
number,
{ rejectValue: string; state: { lines: LineState; entity: EntityState } }
>(
  "line/deleteLine",
  async function (id: number, { rejectWithValue, getState, dispatch }) {
    const { entity } = getState()
    const { lines } = getState() 
   
      const resp = await fetch(
        `http://185.244.172.108:8081/v1/outlay-rows/entity/50088/row/${id}/delete`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (!resp.ok) {
        return rejectWithValue("Can't delete line");
      }
      const data = await resp.json();
      if (data.changed.length) {
        data.changed.map((item: ILine) => dispatch(updateLine(item)));
      }
      dispatch(deleteOneLine(id));
      // creting new line, when delteting last line
      if (lines.value.length === 1&& (!lines.value[0].child || !lines.value[0].child.length)) {

        dispatch(addLine(firstItem.current));
        dispatch(
          setLevel({ ...firstItem.current, id: firstItem.current.id, level: 0 })
        );

        return data;
      }
      return data;
   
  }
);
export const updateLine = createAsyncThunk<
  ILine,
  ILine,
  { rejectValue: string }
>(
  "line/updateLine",
  async function (updatedLine: ILine, { rejectWithValue, dispatch }) {
   
      const resp = await fetch(
        `http://185.244.172.108:8081/v1/outlay-rows/entity/50088/row/${updatedLine.id}/update`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedLine),
        }
      );
      if (!resp.ok) {
        return rejectWithValue("Can't add new line");
      }
      const data = await resp.json();
      if (data.changed.length) {
        // dispatch(setChildForLine(data));
        dispatch(
          setLevel({
            ...data.current,
            id: data.current.id,
            level: data.changed.length,
          })
        );
        data.changed.map((item: ILine) => dispatch(updateLine(item)));
      }
      dispatch(updateLineData(data.current));

      return data;
  
  }
);
// Define a type for the slice state
interface LineState {
  value: ILine[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null | undefined;
}

// Define the initial state using that type
const initialState: LineState = {
  value: [],
  status: "idle",
  error: null,
};

export const lineSlice = createSlice({
  name: "line",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addLine(state, action: PayloadAction<ILine>) {
      state.value.push(action.payload);
    },
    updateLineData(state, action: PayloadAction<ILine>) {
      const lineData = findObj(state.value, action.payload.id || 0);

      if (lineData) {
        lineData.rowName = action.payload.rowName;
        lineData.salary = action.payload.salary;
        lineData.equipmentCosts = action.payload.equipmentCosts;
        lineData.overheads = action.payload.overheads;
        lineData.estimatedProfit = action.payload.estimatedProfit;
      }
    },
    setLevel(state, action: PayloadAction<ILine>) {
      const lineData = findObj(state.value, action.payload.id || 0);

      if (lineData) {
        lineData.level = action.payload.level;
      }
    },
    setChildForLine(
      state,
      action: PayloadAction<{ current: ILine; changed: any[] }>
    ) {
      const lineData = findObj(state.value, action.payload.changed[0].id);
      if (lineData) {
        lineData.child = lineData.child
          ? [...lineData.child, action.payload.current]
          : [action.payload.current];
      }
    },
    deleteOneLine(state, action: PayloadAction<number>) {
      function removeById(state: any[], filter: number) {
        state.forEach((item, index) => {
          if (item.id === filter) {
            state.splice(index, 1);
          }
        });

        for (let i = 0; i < state.length; i++) {
          if (state[i].child) {
            removeById(state[i].child, filter);
          }
        }
      }

      removeById(state.value, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder

      //fetch lines
      .addCase(fetchLines.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchLines.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.value = action.payload;
      })
      .addCase(fetchLines.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // create new line
      .addCase(createLine.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(createLine.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createLine.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // update line
      .addCase(updateLine.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(updateLine.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateLine.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // delete line
      .addCase(deleteLine.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(deleteLine.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteLine.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  addLine,
  updateLineData,
  deleteOneLine,
  setChildForLine,
  setLevel,
} = lineSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectLine = (state: RootState) => state.lines.value;

export default lineSlice.reducer;
