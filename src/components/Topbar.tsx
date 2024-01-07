'use client'
import { auth } from "@/Firebase/firebase";
import { authModalState } from "@/atoms/authModalAtom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { BsList } from "react-icons/bs";
import { FiChevronLeft, FiChevronRight, FiLogOut } from "react-icons/fi";
import { useSetRecoilState } from "recoil";
import { toast } from "sonner";
import Timer from "./Timer";
import { problems } from "@/utils/problems";

type TopbarProps = {
  problemPage?: boolean;
  params?:string
};
const Topbar: React.FC<TopbarProps> = ({ problemPage,params }) => {
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);

  const [problemIndex, setProblemIndex] = useState<number>(0)
  const router=useRouter()
  const handleProblemChange=(isForward:boolean)=>{
    const problem=problems[params!]
    const order=problem.order
    const direction=isForward?1:-1
    const nextProblemOrder=order+direction
    const nextProblemKey=Object.keys(problems).find((key)=>problems[key].order===nextProblemOrder)
    if(isForward && !nextProblemKey){
      const firstProblemKey=Object.keys(problems).find((key)=>problems[key].order===1)
      router.push(`${firstProblemKey}`)
      return
    }
    else if(!isForward && !nextProblemKey){
      const lastProblemKey=Object.keys(problems).find((key)=>problems[key].order===Object.keys(problems).length)
      router.push(`${lastProblemKey}`)
      return
    }
    if(nextProblemKey)router.push(`${nextProblemKey}`)
  }
  return (
    <nav className="relative flex h-[50px] w-full shrink-0 items-center px-5 bg-[#282828] text-[#b3b3b3]">
      <div
        className={`flex w-full items-center justify-between ${
          !problemPage ? "max-w-[1200px] mx-auto" : ""
        }`}
      >
        <Link href="/" className="h-[22px] flex-1">
          <Image
            src="/logo-full.png"
            alt="e-coderhub"
            height={100}
            width={100}
          />
        </Link>

        {problemPage && (
          <div className="flex items-center gap-4 flex-1 justify-center">
            <div className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer" onClick={()=>handleProblemChange(false)} >
              <FiChevronLeft />
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer"
            >
              <BsList />
              <p>Problem List</p>
            </Link>
            <div className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer" onClick={()=>handleProblemChange(true)}>
              <FiChevronRight />
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4 flex-1 justify-end">
          <div>
            <a
              href="https://www.youtube.com/watch?v=xvFZjo5PgG0"
              target="_blank"
              rel="noreferrer"
              className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-[#ffa116] hover:bg-dark-fill-2"
            >
              Premium
            </a>
          </div>
          {!user && (
            <Link href="/auth">
              <button
                className="bg-dark-fill-3 py-1 px-2 cursor-pointer rounded "
                onClick={() =>
                  setAuthModalState({ isOpen: true, type: "login" })
                }
              >
                Sign In
              </button>
            </Link>
          )}
          {user && problemPage && <Timer/>}
          {user && (
            <div className="cursor-pointer group relative">
              <Image
                src="/avatar.png"
                className="rounded-full"
                height={30}
                width={30}
                alt="avatar"
              />
              <div
                className="absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg z-40 group-hover:scale-100 scale-0 
		transition-all duration-300 ease-in-out"
              >
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
          )}
          {user && <Logout />}
        </div>
      </div>
    </nav>
  );
};

export default Topbar;

function Logout() {
  const [signOut, loading, error] = useSignOut(auth);
  return (
    <button
      className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded-sm text-brand-orange"
      onClick={async () => {
        const success = await signOut();
        if (success) {
          toast.success("You are logged out successfully!");
        }
      }}
    >
      <FiLogOut />
    </button>
  );
}
