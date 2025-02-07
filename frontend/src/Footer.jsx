import React from 'react'
import {BsFacebook, BsInstagram, BsTwitterX, BsLinkedin, BsX} from 'react-icons/bs'
function Footer() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
  return (
    <footer className='relative left-0 bottom-0 h-[10h] flex flex-col sm: flex-row items-center justify-between text-white bg-gray-800'>
        <h1>Footer</h1>
        <section className='text-lg'>
            copyright {year}
        </section>
        <section className='flex items-center justify-center gap-5 text-2xl text-white'>
            <a className='hover:text-yellow-500 transition-all ease-in-out duration-300'>
                <BsFacebook></BsFacebook>
            </a>
            <a className='hover:text-yellow-500 transition-all ease-in-out duration-300'>
                <BsInstagram></BsInstagram>
            </a>
            <a className='hover:text-yellow-500 transition-all ease-in-out duration-300'>
                <BsLinkedin></BsLinkedin>
            </a>
            <a className='hover:text-yellow-500 transition-all ease-in-out duration-300'>
                <BsTwitterX></BsTwitterX>
            </a>
            
        </section>
    </footer>
  )
}

export default Footer