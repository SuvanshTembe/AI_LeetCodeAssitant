import React from 'react'
import ComplexityGraph from './Components/ComplexityGraph'
import Input from './Components/Input'
import Output from './Components/Output'

function App() {
  return (
    <div className='h-screen w-full flex items-center justify-center' style={{ background: '#19191C' }}>
      <ComplexityGraph></ComplexityGraph>
    </div>
  )
}

export default App
