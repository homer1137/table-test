import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { selectLine } from "./store/lineSlice";
import { fetchLines, createLine } from "./store/lineSlice";
import { fetchEntity } from "./store/entitySlice";
import { NavBar } from "./components/NavBar/NavBar";
import { Table } from "./components/Table/Table";

import "./App.css";

function App() {
  const dispatch = useAppDispatch();
  const line = useAppSelector(selectLine);
  const entity = useAppSelector((state) => state.entity.value.id);
  const lines = useAppSelector((state) => state.lines.value);
  // const {error, status} = useAppSelector((state)=>state.entity)
  const { error, status } = useAppSelector((state) => state.lines);

  useEffect(() => {
    dispatch(fetchEntity());
  }, [dispatch]);
  useEffect(() => {
    if (entity) {
      dispatch(fetchLines());
    }
  }, [entity, dispatch]);

  return (
    <>
      <NavBar />
      <Table />
      {error && <h2>you got and error: {error}</h2>}
      {status === "pending" && <div>data is loading</div>}
      <div>{line.length}</div>
      <div>{entity}</div>
      <button
        onClick={() =>
          dispatch(
            createLine({
              child: [null],
              equipmentCosts: 0,
              estimatedProfit: 0,
              machineOperatorSalary: 0,
              mainCosts: 0,
              materials: 0,
              mimExploitation: 0,
              overheads: 0,
              parentId: null,
              rowName: "",
              salary: 0,
              supportCosts: 0,
            })
          )
        }
      >
        create new line
      </button>
    </>
  );
}

export default App;
