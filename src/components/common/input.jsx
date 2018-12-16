import React from 'react';

const Input = ({ name, label, disabled, error, ...rest }) => {
  return ( 
    <div className="form-group" id={name}>
      {label && <label htmlFor={name}>{ label }</label> }
      <input {...rest} name={name} disabled={disabled} id={name} className="form-control" />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
   );
}
 
export default Input;