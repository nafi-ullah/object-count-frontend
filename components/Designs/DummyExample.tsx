import React, { useState } from 'react';
import ProgressBar from './ProgressBar';

const ProgressExample: React.FC = () => {
  const [isGotResponse, setIsGotResponse] = useState(false);

  // Simulate getting a response after a delay
  setTimeout(() => {
    setIsGotResponse(true);
  }, 20000); // Simulate a delay of 5 seconds

  return (
    <div className="p-4 w-full">
      <h1 className="text-xl mb-4">Progress Bar Example</h1>
      <ProgressBar seconds={10} isGotResponse={isGotResponse} />
    </div>
  );
};

export default ProgressExample;
