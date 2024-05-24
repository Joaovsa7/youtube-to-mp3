import React from 'react';

interface Props {
  title?: string;
  thumbnail?: string;
  duration?: string;
}

const Preview: React.FC<Props> = ({ title, thumbnail, duration }) => (
  <div className="flex items-center p-5 rounded-lg border border-gray-300 bg-gray-100 mb-5">
    <div className="h-full mr-5">
      <img src={thumbnail} alt={title} className="w-30" />
    </div>
    <div className="mr-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-xs">Duration: {duration}</p>
    </div>
  </div>
);

export default Preview;
