import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { deleteLine, updateLine, createLine } from "../../store/lineSlice";

import "./TableItem.scss";
import basket from "./assets/dasbin.png";
import list from "./assets/list.png";

interface ILine {
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
  level?: number;
}
type Props = {
  line: ILine;
 
};

export const TableItem = ({ line }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [lineData, setLineData] = useState({
    id: line.id,
    rowName: line.rowName,
    salary: line.salary,
    equipmentCosts: line.equipmentCosts,
    overheads: line.overheads,
    estimatedProfit: line.estimatedProfit,
    child: [],
    machineOperatorSalary: 0,
    mainCosts: 0,
    materials: 0,
    parentId: null,
    supportCosts: 0,
    mimExploitation: 0,
  });

  const lines = useAppSelector((state) => state.lines.value);

 
  // let level=0
  // function findObj(state: any[], value: number): any {
    
  //   let fo = state.find((li) => li.id === value);
  //   if (!fo) {
  //     level+=1
  //     for (let i = 0; i < state.length; i++) {
  //       if (state[i].child) {
  //         const fo2 = findObj(state[i].child, value);
  //         if (fo2) return fo2;
  //       }
  //     }
  //   } else return fo;
  // }
  // line.id&&findObj(lines, line.id)
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLineData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      dispatch(updateLine(lineData));
      setEditMode(false);
    }
    if (event.code === "Escape") {
      setEditMode(false);
    }
  };

  const dispatch = useAppDispatch();
  return (
    <div
      className="tableItem"
      key={line.id}
      onDoubleClick={() => setEditMode((prev) => !prev)}
    >
      <div className="tableItem__level">
        <div className="tableItem__item_withParent">{line.level}</div>
        <div>
          <img
          className="tableItem__list"
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
                  parentId: line.id ? line.id : null,
                  rowName: "",
                  salary: 4,
                  supportCosts: 0,
                })
              )
            }
            src={list}
            height={15}
            width={13}
            alt="create new line"
          />

          <img
            onClick={() => dispatch(deleteLine(line.id ? line.id : 0))}
            src={basket}
            height={16}
            width={16}
            alt="delete"
          />
        </div>
      </div>
      {editMode ? (
        <input
          className="tableItem__input"
          type="text"
          name="rowName"
          onChange={handleChange}
          onKeyDown={keyDownHandler}
          value={lineData.rowName}
        />
      ) : (
        <div className="tableItem__title">{line.rowName}</div>
      )}
      {editMode ? (
        <input
          className="tableItem__input"
          type="number"
          name="salary"
          onChange={handleChange}
          onKeyDown={keyDownHandler}
          value={lineData.salary}
        />
      ) : (
        <div className="tableItem__number">{line.salary}</div>
      )}
      {editMode ? (
        <input
          className="tableItem__input"
          type="number"
          name="equipmentCosts"
          onChange={handleChange}
          onKeyDown={keyDownHandler}
          value={lineData.equipmentCosts}
        />
      ) : (
        <div className="tableItem__number">{line.equipmentCosts}</div>
      )}
      {editMode ? (
        <input
          className="tableItem__input"
          type="number"
          name="overheads"
          onChange={handleChange}
          onKeyDown={keyDownHandler}
          value={lineData.overheads}
        />
      ) : (
        <div className="tableItem__number">{line.overheads}</div>
      )}
      {editMode ? (
        <input
          className="tableItem__input"
          type="number"
          name="estimatedProfit"
          onChange={handleChange}
          onKeyDown={keyDownHandler}
          value={lineData.estimatedProfit}
        />
      ) : (
        <div className="tableItem__number">{line.estimatedProfit}</div>
      )}
    </div>
  );
};
