import React, {useEffect, useState} from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks'
import { selectLine } from './store/lineSlice';
import { fetchLines, createLine } from './store/lineSlice'
import {  fetchEntity } from './store/entitySlice';
import {NavBar} from './components/NavBar/NavBar'
import {Table} from './components/Table/Table'

import './App.css';

function App() {

const dispatch = useAppDispatch()
const line = useAppSelector(selectLine)
const entity = useAppSelector((state)=>state.entity.value.id)
const lines = useAppSelector((state)=>state.lines.value)
// const {error, status} = useAppSelector((state)=>state.entity)
const {error, status}=useAppSelector((state)=>state.lines)

useEffect(()=>{
  dispatch(fetchEntity())
}, [dispatch])
useEffect(()=>{
  if(entity){
    dispatch(fetchLines())
  }
  
}, [entity, dispatch])

console.log('lines', lines)
  return (
    < >
      
      <NavBar/> 
      <Table/>
      {error&&<h2>you got and error: {error}</h2>}
      {status==='pending'&&<div>data is loading</div>}
      <div>{line.length}</div>
    
      <div>{entity}</div>
      
      <button onClick={()=>dispatch(createLine({
        child: [null],
        equipmentCosts: 2,
        estimatedProfit: 1,
        machineOperatorSalary: 3,
        mainCosts: 4,
        materials: 1,
        mimExploitation: 5,
        overheads: 2,
        parentId: null,
        rowName: 'sdf',
        salary: 4,
        supportCosts: 3
      })) }>create new line</button>
      
     
    </>
  );
} 

export default App;
