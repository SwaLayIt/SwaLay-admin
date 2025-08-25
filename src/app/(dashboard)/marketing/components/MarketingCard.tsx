import React from 'react';
import Image from 'next/image';

interface MarketingCardProps {
  albumId: string;
  imageSrc: string;
  albumName: string;
  albumArtist: string;
  status: string;
}

const MarketingCard: React.FC<MarketingCardProps> = ({
  albumId,
  imageSrc,
  albumName,
  albumArtist,
  status,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'selected':
        return 'bg-green-100 text-green-800';
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'pitched':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 m-2 w-64">
      <div className="relative h-48 bg-gray-200">
        {!imageError ? (
          <Image
            src={imageSrc}
            alt={albumName}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status || 'Unknown'}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 truncate" title={albumName}>
          {albumName || 'Unknown Album'}
        </h3>
        <p className="text-gray-600 text-sm truncate" title={albumArtist}>
          {albumArtist || 'Unknown Artist'}
        </p>
      </div>
    </div>
  );
};

export default MarketingCard;
