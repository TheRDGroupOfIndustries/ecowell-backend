import React, { useState } from 'react';
import { FormGroup, Label, Input, Button } from 'reactstrap';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';

interface Faq {
  question: string;
  answer: string;
}

interface FaqInputFieldProps {
  label: string;
  faqs: Faq[];
handleChange: (field: string, value: any) => void;
}

const FaqInputField: React.FC<FaqInputFieldProps> = ({ label, faqs, handleChange }) => {
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newAnswer, setNewAnswer] = useState<string>('');

  const handleAddFaq = () => {
    if (newQuestion.trim() !== '' && newAnswer.trim() !== '') {
      handleChange('faqs', [...faqs, { question: newQuestion, answer: newAnswer }]);
      setNewQuestion('');
      setNewAnswer('');
    }
  };

  const handleDeleteFaq = (index: number) => {
    handleChange('faqs', faqs.filter((_: any, i: number) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFaq();
    }
  };

  return (
    <FormGroup>
      <Label className="col-form-label">{label}</Label>
      {faqs.map((faq, index) => (
        <div key={index} className="d-flex align-items-center justify-content-between mb-2">
          <div>
            <strong>Q:</strong> {faq.question} <br />
            <strong>A:</strong> {faq.answer}
          </div>
          <Button color="danger" size="sm" className="dangerBtn px-3 py-2" onClick={() => handleDeleteFaq(index)}>
            <AiOutlineDelete size={20} />
          </Button>
        </div>
      ))}
      <div className="d-flex flex-column gap-2">
        <Input
          type="text"
          placeholder="Question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          className="me-2"
        />
        <Input
          type="textarea"
          placeholder="Answer"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button color="primary" size="sm" className="px-3 py-2 align-self-start d-flex align-items-center justify-content-center" onClick={handleAddFaq}>
          <FaPlus size={20} className="me-2" /> Add FAQ
        </Button>
      </div>
    </FormGroup>
  );
};

export default FaqInputField;