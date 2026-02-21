import { useQuery } from "@tanstack/react-query"

import { getHello } from './api'

function App() {
  const hello = useQuery({ queryKey: ['hello'], queryFn: getHello })

  return (
    <div>
      {hello.data}
    </div>
  )
}

export default App
