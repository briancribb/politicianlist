import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MemberList from './MemberList.jsx'

/*
Not sure if I really need a context with this thing, but I might 
add one just to show that I know how.
*/
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MemberList />
  </StrictMode>,
)
 