import React from 'react'
import ReactDOM from 'react-dom'

import './page.css'

function PageAction() {
  return <div className='text-5xl text-red-500'>Hello Page Actions</div>
}

const newNode = document.createElement('div')
document.body.appendChild(newNode)

ReactDOM.render(
  <React.StrictMode>
    <PageAction />
  </React.StrictMode>,
  newNode,
)
