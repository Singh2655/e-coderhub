"use client"
import { auth } from '@/Firebase/firebase'
import { authModalState } from '@/atoms/authModalAtom'
import Navbar from '@/components/Navbar'
import AuthModal from '@/components/modals/AuthModal'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilValue } from 'recoil'

type Props = {}

const Page = (props: Props) => {
  const router=useRouter()
  const authModal=useRecoilValue(authModalState)
  const [user,loading,error]=useAuthState(auth)
  const [pageLoading, setPageLoading] = useState<boolean>(true)
  if(user)console.log(user)
  useEffect(()=>{
    if(user)router.push('/')
    if(!user && !loading)setPageLoading(false);
  },[user,router,loading])
if(pageLoading)return null
  return (
    <div className='bg-gradient-to-b from-gray-600 to-black h-screen relative'>
      <div className="max-w-7xl mx-auto">
        <Navbar/>
        <div className="flex items-center justify-center h-[calc(100vh-5rem)] pointer-events-none select-none">
          <Image src="/hero.png" alt='faang' height={800} width={800} />
        </div>
        {authModal.isOpen && <AuthModal/>}
      </div>
    </div>
  )
}

export default Page