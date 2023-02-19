import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  deleteLine,
  updateLine,
  createLine,
  setChildForLine,
  setLevel,
  deleteOneLine,
} from "../../store/lineSlice";
import { ILine } from "./TableItem.type";

import "./TableItem.scss";
import basket from "./assets/dasbin.png";
import list from "./assets/list.png";


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
    parentId: line.parentId ? line.parentId : null,
    supportCosts: 0,
    mimExploitation: 0,
  });
  useEffect(() => {
    if (line.new) {
      setEditMode(true);
    }
  }, []);

  const lines = useAppSelector((state) => state.lines.value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLineData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      if (line.new) {
        dispatch(
          createLine(lineData)
        );
        dispatch(deleteOneLine(line.id ? line.id : 0))
      } else {
        dispatch(updateLine(lineData));
        setEditMode(false);
      }
    }
    if (event.code === "Escape"&&!line.new) {
      setEditMode(false);
    }
  };
  const dataItem = {
    current: {
      id: Math.floor(100000 + Math.random() * 900000),
      rowName: "",
      total: 0,
      salary: 1,
      mimExploitation: 0,
      machineOperatorSalary: 0,
      materials: 0,
      mainCosts: 0,
      supportCosts: 0,
      equipmentCosts: 0,
      overheads: 0,
      estimatedProfit: 0,
      new: true,
      parentId: line.id ? line.id : null,
    },
    changed: [
      {
        id: line.id,
      },
    ],
  };
  const createNewLine = () => {
    dispatch(
      setChildForLine(dataItem)
    );
    dispatch(setLevel({ ...dataItem.current, id: dataItem.current.id, level: line.level && line.level + 1 }));
  };

  const paddingSize = (level: number): number => {
    switch (level) {
      case 1:
        return 1;
      case 2:
        return 0.9;
      default:
        return 0.9;
    }
  };

  const dispatch = useAppDispatch();
  return (
    <div
      className="tableItem"
      key={line.id}
      onDoubleClick={() => setEditMode(true)}
    >
      <div
        className="tableItem__level"
        style={{
          paddingLeft: `${
            line.level ? line.level * 23 * paddingSize(line.level) : 16
          }px`,
        }}
      >
        <div className="tableItem__item_withParent"></div>
        {editMode ? (
          <div className="tableItem__icons_edit">
            <img
              className="tableItem__list"
              // onClick={createNewLine}
              src={list}
              height={15}
              width={13}
              alt="create new line"
            />

            <img
              onClick={() => {
                line.new
                  ? dispatch(deleteOneLine(line.id ? line.id : 0))
                  : dispatch(deleteLine(line.id ? line.id : 0));
              }}
              src={basket}
              height={16}
              width={16}
              alt="delete"
            />
          </div>
        ) : (
          <div>
            <img
              className="tableItem__list"
              onClick={createNewLine}
              src={list}
              height={15}
              width={13}
              alt="create new line"
            />
          </div>
        )}
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
