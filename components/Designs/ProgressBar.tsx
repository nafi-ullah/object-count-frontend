import { useEffect, useState } from 'react';

type ProgressBarProps = {
  seconds: number;
  isGotResponse: boolean;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ seconds, isGotResponse }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isGotResponse) {
      const targetProgress = Math.floor(Math.random() * (95 - 90 + 1)) + 90;

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < targetProgress) {
            return prev + (targetProgress / (seconds+1));
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 1000);
    } else {
      setProgress(100);
    }

    return () => clearInterval(interval);
  }, [seconds, isGotResponse]);

  useEffect(() => {
    if (isGotResponse) {
      setProgress(100);
    }
  }, [isGotResponse]);

  useEffect(()=>{},[seconds])

  return (
    <div className='w-full'>
         <div className='w-full flex justify-end'>{Math.floor(progress)}% Completed</div>
    <div className="w-full bg-gray-600 rounded-full h-2">
       
      <div
        className="bg-blue-600 h-2 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    </div>
  );
};

export default ProgressBar;
