import React from 'react';
import Input from './input';

const SearchBox = ({ value, onChange }) => {
  return ( 
      <Input
        type="text"
        name="query"
        className="form-control"
        placeholder="Search..."
        value={value}
        onChange={e => onChange(e.currentTarget.value)}
        style={{ marginBottom: '1%' }}
        />
   );
}
 
export default SearchBox;