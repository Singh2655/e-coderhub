import { FC, useState } from 'react'
import Split from 'react-split'
import Playground from './Playground'
import ProbelmDiscription from './ProbelmDiscription'

interface WorkspaceProps {
  params:string
}

const Workspace: FC<WorkspaceProps> = ({params}) => {
  const [success, setSuccess] = useState<boolean>(false)
  const [solved, setSolved] = useState<boolean>(false)
  return <Split className='split' minSize={0}>
    <ProbelmDiscription params={params} _solved={solved}/>
    <Playground params={params} setSuccess={setSuccess} setSolved={setSolved}/>
  </Split>
}

export default Workspace