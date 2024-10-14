import { signInInput, SignInInput } from '@soham54/chess-1'
import React from 'react'

const LabelledInput = ({placeholder,label,name,onChange}:{
    placeholder : string,
    label : string,
    name : string,
 
    onChange : any
}) => {
  return (
    <div>
        <label htmlFor={name}>
            {label}
            <input name={name} type="text" placeholder={placeholder} onChange={onChange}/>
        </label>
    </div>
  )
}

export default LabelledInput
