import React from 'react';

const TextArea = ({ name, label, disabled, error, ...rest }) => {
  return ( 
    <div className="form-group">
      <label htmlFor={name}>{ label }</label>
      <textarea {...rest} name={name} disabled={disabled} id={name} rows="4" className="rounded-4 form-control" />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
   );
}
 
export default TextArea;