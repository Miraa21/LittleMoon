import React from 'react'
import { Spinner } from 'react-bootstrap'
function loader() {
  return (
    <Spinner animation='border'
    role='status'
     style={{
        height:'100px',
        width:'100px',
        margin:'auto',
        display:'block'
     }}>
    <span className='sr-only'>Hold on a moment..</span>
    </Spinner>
  )
}

export default loader
