import React, { ReactNode } from "react";
import { IconSvg } from "./icons";
import "./TableSideBar.style.scss";

const ArrowDown = () => (
  <svg
    width="12"
    height="8"
    viewBox="0 0 12 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.41 0.589996L6 5.17L10.59 0.589996L12 2L6 8L0 2L1.41 0.589996Z"
      fill="white"
    />
  </svg>
);

interface SideBarProps {
  children?: ReactNode;
  menuItems?: {
    id: number;
    title: string;
  }[];
}

const initialMenuItems = [
  { id: 1, title: "По проекту" },
  { id: 2, title: "Объекты" },
  { id: 3, title: "РД" },
  { id: 4, title: "МТО" },
  { id: 5, title: "СМР" },
  { id: 6, title: "График" },
  { id: 7, title: "МиМ" },
  { id: 8, title: "Рабочие" },
  { id: 9, title: "Капвложения" },
  { id: 10, title: "Бюджет" },
  { id: 11, title: "Финансирование" },
  { id: 12, title: "Панорамы" },
  { id: 14, title: "Камеры" },
  { id: 15, title: "Поручения" },
];

export const TableSideBar = ({
  menuItems = initialMenuItems,
}: SideBarProps) => {
  return (
    <>
      <aside className="aside">
        <div className="aside__title">
          <div className="aside__title-section">
            <h2>Название проекта</h2>
            <span>Аббревиатура</span>
          </div>
          <div className="aside__arrow_down">
            <ArrowDown />
          </div>
        </div>

        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="aside__item">
              <IconSvg /> <span>{item.title}</span>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};
