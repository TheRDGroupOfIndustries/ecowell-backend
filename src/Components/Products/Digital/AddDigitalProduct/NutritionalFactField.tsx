import React, { useEffect, useState } from 'react';
import { FormGroup, Label, Input, Button } from 'reactstrap';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';

interface NutritionalFactFieldProps {
  label: string;
  nutritionFacts: any;
  handleArrayChange: any;
}

const NutritionalFactField: React.FC<NutritionalFactFieldProps> = ({ label, nutritionFacts, handleArrayChange }) => {
  const [newName, setNewName] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');

  const handleAddNutritionalFact = () => {
    if (newName.trim() !== '' && newValue.trim() !== '') {
      let newFact = `${newName}: ${newValue}`;
      handleArrayChange('nutritionFacts', [...nutritionFacts, newFact]);
      setNewName('');
      setNewValue('');
    }
  };

  const handleDeleteNutritionalFact = (index: number) => {
    handleArrayChange('nutritionFacts', nutritionFacts.filter((_: any, i: number) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNutritionalFact();
    }
  };

  useEffect(() => {
    console.log('newVariant.nutritionFacts:', nutritionFacts);
  }, [nutritionFacts]);

  return (
    <FormGroup>
      <Label className="col-form-label">{label}</Label>
      {nutritionFacts && nutritionFacts.length > 0 && nutritionFacts.map((fact:any, index:any) => (
        <div key={index} className="d-flex align-items-center justify-content-between mb-2">
          <div>{fact}</div>
          <Button color="danger" size="sm" className="dangerBtn px-3 py-2" onClick={() => handleDeleteNutritionalFact(index)}>
            <AiOutlineDelete size={20} />
          </Button>
        </div>
      ))}
      <div className="d-flex flex-column gap-2">
        <Input
          type="text"
          placeholder="Nutritional Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="me-2"
        />
        <Input
          type="text"
          placeholder="Value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button color="primary" size="sm" className="px-3 py-2 align-self-start d-flex align-items-center justify-content-center" onClick={handleAddNutritionalFact}>
          <FaPlus size={20} className="me-2" /> Add Nutritional Fact
        </Button>
      </div>
    </FormGroup>
  );
};

export default NutritionalFactField;