import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MemberList from './MemberList.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MemberList />
  </StrictMode>,
)
 