import React, { useState } from 'react';
import { FormGroup, Label, Input, Button } from 'reactstrap';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';

interface MultiInputFieldProps {
  label: string;
  items?: string[];
  handleArrayChange:any;
  fieldName: string;
}

const MultiInputField: React.FC<MultiInputFieldProps> = ({ label, items, handleArrayChange, fieldName }) => {
  const [newItem, setNewItem] = useState<string>('');

  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      if (!items) 
        handleArrayChange(fieldName, [newItem]);
      else
      handleArrayChange(fieldName, [...items, newItem]);
      setNewItem('');
    }
  };

  const handleDeleteItem = (index: number) => {
    if (items)
    handleArrayChange(fieldName, items.filter((_: any, i: number) => i !== index));
  };

  return (
    <FormGroup>
      <Label className="col-form-label">{label}</Label>
      {items && items.map((item, index) => (
        <div key={index} className="d-flex align-items-center justify-content-between mb-2">
          <span className='text-black-50'>{item}</span>
          <Button color='danger' size="sm" className="dangerBtn px-3 py-2" onClick={() => handleDeleteItem(index)}>
            <AiOutlineDelete size={20} />
          </Button>
        </div>
      ))}
      <div className="d-flex align-items-center">
        <Input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
        />
        <Button color="primary" size="sm" className="ms-2 px-3 py-2" onClick={handleAddItem}>
          <FaPlus size={20} />
        </Button>
      </div>
    </FormGroup>
  );
};

export default MultiInputField;