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
}
type Props = {
  line: ILine;
  parent?: boolean;
  child?: boolean;
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
      <div className={`tableItem__title table__item_withParent`}>
        <span className="tableItem_">{editMode ? "true" : "false"}</span>
        <img 
        onClick={() => dispatch(createLine({
          child: [null],
          equipmentCosts: 2,
          estimatedProfit: 1,
          machineOperatorSalary: 3,
          mainCosts: 4,
          materials: 1,
          mimExploitation: 5,
          overheads: 2,
          parentId: line.id ? line.id : 0,
          rowName: 'sdf',
          salary: 4,
          supportCosts: 3
        }))}
        src={list} height={15} width={13} alt="delete" />

        <img
          onClick={() => dispatch(deleteLine(line.id ? line.id : 0))}
          src={basket}
          height={16}
          width={16}
          alt="list"
        />
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
