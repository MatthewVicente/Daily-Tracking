import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { Habit } from './components/Habit'

function App() {

  return (
    <div>
      <Habit completed={3}/>
      <Habit completed={2}/>
      <Habit completed={1}/>
    </div>
  )
}

export default App
