import React, { useEffect, useState } from 'react';

// Define the props interface
interface AnimatedTextProps {
  text: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`text-gray-500 ${isVisible ? 'fade-in' : 'opacity-0'} mx-1`}>
      {text}
    </div>
  );
};

export default AnimatedText;
