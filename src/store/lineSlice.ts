import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "./store";

function findObj(state: any[], value: number): any {
  let fo = state.find((li) => li.id === value);
  if (!fo) {
    for (let i = 0; i < state.length; i++) {
      if (state[i].child) {
        const fo2 = findObj(state[i].child, value);
        if (fo2) return fo2;
      }
    }
  } else return fo;
}

export interface ILine {
  id?: number;
  child: any[];
  equipmentCosts: number;
  estimatedProfit: number;
  machineOperatorSalary: number;
  mainCosts: number;
  materials: number;
  mimExploitation: number;
  overheads: number;
  parentId: number | null;
  rowName: string;
  salary: number;
  supportCosts: number;
}

export const fetchLines = createAsyncThunk(
  "line/fetchLines",
  async function (_, { rejectWithValue, getState }) {
    const { entity } = getState() as RootState;
    try {
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
        throw new Error("Server error");
      }
      const data = await resp.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const createLine = createAsyncThunk(
  "line/createLine",
  async function (newLine: ILine, { rejectWithValue, getState, dispatch }) {
    const { entity } = getState() as RootState;
    try {
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
        throw new Error("Can't add new line");
      }
      const data = await resp.json();

      if (data.changed.length) {
        // const parentLine = {
        //   ...data.changed[0],
        //   child: data.changed.child
        //     ? [...data.changed.child, data.current]
        //     : [data.current],
        // };
        // const response = await fetch(
        //   `http://185.244.172.108:8081/v1/outlay-rows/entity/50088/row/${parentLine.id}/update`,
        //   {
        //     method: "POST",
        //     headers: {
        //       Accept: "application/json",
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(parentLine),
        //   }
        // );
        // if (!response.ok) {
        //   throw new Error("Can't add new line");
        // }
        // const data2 = await response.json();

        dispatch(setChildForLine(data));
        data.changed.map((item: ILine) => dispatch(updateLine(item)));
        // return data2;
      } else {
        dispatch(addLine(data.current));
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const deleteLine = createAsyncThunk(
  "line/deleteLine",
  async function (id: number, { rejectWithValue, getState, dispatch }) {
    const { entity } = getState() as RootState;
    try {
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
        throw new Error("Can't add new line");
      }
      const data = await resp.json();

      dispatch(deleteOneLine(id));

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateLine = createAsyncThunk(
  "line/updateLine",
  async function (updatedLine: ILine, { rejectWithValue, dispatch }) {
    try {
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
        throw new Error("Can't add new line");
      }
      const data = await resp.json();

      dispatch(updateLineData(data.current));

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
// Define a type for the slice state
interface LineState {
  value: ILine[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null | any;
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
    addLine(state, action) {
      state.value.push(action.payload);
    },
    updateLineData(state, action) {
      const lineData = findObj(state.value, action.payload.id);

      if (lineData) {
        lineData.rowName = action.payload.rowName;
        lineData.salary = action.payload.salary;
        lineData.equipmentCosts = action.payload.equipmentCosts;
        lineData.overheads = action.payload.overheads;
        lineData.estimatedProfit = action.payload.estimatedProfit;
      }
    },
    setChildForLine(state, action) {
      const lineData = findObj(state.value, action.payload.changed[0].id);
      if (lineData) {
        lineData.child = lineData.child
          ? [...lineData.child, action.payload.current]
          : [action.payload.current];
      }
    },
    deleteOneLine(state, action) {
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
      // state.value = state.value.filter((line) => line.id !== action.payload);
      // state.value = filterAll(state.value, action.payload)
      removeById(state.value, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder

      //fetch lines
      .addCase(fetchLines.pending, (state) => {
        state.status = "pending";
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

export const { addLine, updateLineData, deleteOneLine, setChildForLine } =
  lineSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectLine = (state: RootState) => state.lines.value;

export default lineSlice.reducer;
