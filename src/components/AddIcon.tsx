import React from 'react';

interface AddIconProps {
  boxSize?: string;
}

const AddIcon: React.FC<AddIconProps> = ({ boxSize = '20px' }) => {
  return (
    <svg
      width={boxSize}
      height={boxSize}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 4.16666V15.8333M4.16666 10H15.8333"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AddIcon;
