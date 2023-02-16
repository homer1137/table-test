import { TableItem } from "../TableItem/TableItem";
import { TableSideBar } from "../TableSideBar/TableSideBar";
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import './Table.style.scss'
import { ILine } from "../../store/lineSlice";

type Props = {};
 
export const Table = (props: Props) => {
  const lines = useAppSelector((state)=>state.lines.value)
 
  const LinesChild =({line}: {line: ILine})=>{
    return (
      <>
       <TableItem line={line} key={line.id}/>
        {
        line.child&&line.child.map((lineChild:ILine)=>(
          <div key={lineChild.id} className={'table__child'}>
            <TableItem line={lineChild} key={lineChild.id}/>
            {lineChild.child&&lineChild.child.map((lineChild2:ILine)=><LinesChild line={lineChild2} key={lineChild2.id}/>)}
          </div>
        ))
      }
      </>
    )
   
    }

  return (
    <div className="table">
      <div className="table__tableSideBar">
        <TableSideBar />
      </div>
      <div className="table__tableHeader">
        Строительно-монтажные работы
      </div>
      <div className="table__tableHeader2">
        
      </div>
      <div className="table__resultHeader">
        <div>
          Уровень
        </div>
        <div>
          Наименование работ
        </div>
        <div>
          Основная з/п
        </div>
        <div>
          Оборудование
        </div>
        <div>
          Накладные расходы
        </div>
        <div>
          Сметная прибыль
        </div>
      </div>
      <div className="table__tableItems">
        {/* { lines.length && lines.map((line)=>{
          <TableItem line={line}/>
        })} */}
    
        {
          lines.length&&lines.map(item=>(
            
            <div key={item.id}>
            {/* <TableItem line={item} key={item.id}/>
            {item.child&&item.child.map((lineChild:ILine)=>( */}
              <LinesChild line={item} />
            {/* ))} */}
            </div>  
            
            
            
          ))
        }

      </div>
    </div>
  );
};
