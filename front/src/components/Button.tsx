import React from 'react'
// the children prop represents the content that is placed between the <Button> component's opening and closing tags when it is used.
const Button = ({onClick,children} : {onClick : () => void, children : React.ReactNode}) => { // children is a React.ReactNode that represents the content passed between the component tags.
  // console.log('from button')
  return (
    <button onClick={onClick}className='bg-green-400 hover:bg-green-700 text-white rounded px-8 py-4'>
      {children}
      
    </button>
  )
}

export {Button}
