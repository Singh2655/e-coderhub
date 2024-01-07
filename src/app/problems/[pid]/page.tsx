'use client'
import Topbar from '@/components/Topbar'
import Workspace from '@/components/Workspace'
import useHasMounted from '@/hooks/useHasMounted'
import { problems } from '@/utils/problems'
import { Problem } from '@/utils/types/problem'



const Page = ({params}:any) => {
  const hasMounted=useHasMounted()
  if(!hasMounted)return null
  return (
    <div>
        <Topbar problemPage params={params.pid} />
        <Workspace params={params.pid}/>
    </div>
  )
}

export default Page

// export async function getStaticPath(){
//   const path=Object.keys(problems).map((key)=>{
//     params:{pid:key}
//   })
//   return {
//     path,
//     fallback:false,
//   }
// }

// export async function getInitialProps({params}:{params:{pid:string}}){
//   const {pid}=params
//   const problem=problems[pid]
//   if(!problem){
//     return {
//       notFound:true
//     }
//   }
//   problem.handlerFunction=problem.handlerFunction.toString()
//   console.log("hello",problem)
//   return {
//     props:{
//       problem
//     }
//   }
// }