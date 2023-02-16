import React, {ReactNode} from 'react'
import { BackArrow, Cubes } from './icons';
import './NavBar.scss'

interface Props {
    children?: ReactNode; 
}

export const NavBar = (props: Props) => {
  return (
    <header>
        <div className='header__wraper'>
            <div className='header__item'><Cubes/> </div>
            <div className='header__item'><BackArrow/></div>
            <div className='header__item header__text-active'>Просмотр</div>
            <div className='header__item '>Управление</div>
        </div>
    </header>
  )
}

