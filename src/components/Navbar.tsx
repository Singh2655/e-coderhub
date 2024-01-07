"use client"
import { authModalState } from '@/atoms/authModalAtom'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useSetRecoilState } from 'recoil'

type Props = {}

const Navbar = () => {
  const setAuthModalState=useSetRecoilState(authModalState)
  const handleClick=()=>{
    setAuthModalState((prev)=>({...prev,isOpen:true}))
  }
  return (
    <div className='flex relative items-center justify-between sm:px-12 px-2 md:px-24' >
        <Link href="/" className='flex items-center justify-center h-20'>
            <Image src="/logo.png" alt="e-coderhub" height={150} width={150} />

        </Link>
            <div className="flex items-center">
                <button className='bg-brand-orange text-white px-2 py-1 sm:px-4 rounded-md text-sm font-medium hover:text-brand-orange hover:bg-white hover:border-2 hover:border-brand-orange border-2 border-transparent' onClick={handleClick}>Sign up</button>
            </div>
    </div>
  )
}

export default Navbar