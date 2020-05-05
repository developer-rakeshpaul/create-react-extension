import React from 'react'
import ReactDOM from 'react-dom'

import './options.css'

function Options() {
  return <div className='text-5xl text-gray-500'>Hello Options</div>
}

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById('options'),
)
