import React from 'react'
// import {fiMenu} form 'react-icons/fi'
import { AiFillCloseCircle } from "react-icons/ai";

function HomeLayout() {
    function changeWidth() {
        const drawerSide = document.getElementsByClassName('drawer-side');
        drawerSide[0].style.width = 0;
    }


    function hideDrawer() {
        const element = document.getElementsByClassName('drawer-toggle');
        element[0].checked = false;
        changeWidth();
    }
    return (
        <div className='min-h-[90vh]'>
            <div className='drawer absolute left-0 z-50 w-fit'>
                <input className='drawer-toggle' id='my-drawer' type="checkbox" />
                <div className='drawer-content'>
                    <label htmlFor="my-drawer" className='curser-pointer relative'>
                        <fiMenue onClik={changeWidth} size={'32px'} className='font-bold text-white m-4'></fiMenue>
                    </label>
                </div>
                <div className='drawer-side w-0'>
                    <label htmlFor="my-drawer" className='drawer-overlay'>

                    </label>
                    <ul className='menu p-4 w-48 sm:w-80 bg-base-100 text-base-content relative'>
                        <li className='w-fit absolute right-2 z-500'>
                            <button onClick={hideDrawer}>
                                <AiFillCloseCircle size={24}></AiFillCloseCircle>
                            </button>
                        </li>
                    </ul>

                </div>
            </div>

        </div>
    )
}

export default HomeLayout