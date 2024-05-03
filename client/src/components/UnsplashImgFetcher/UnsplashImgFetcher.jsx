import React, { useState, useEffect } from 'react';
import './UnsplashImgFetcher.scss';

const UnsplashImageFetcher = ({ keyword }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (keyword) {
      const fetchImage = async () => {
        try {
          const response = await fetch(
            `https://api.unsplash.com/search/photos?page=1&query=${keyword}&client_id=OMIS2C4i3UU3Q4RDwR5JkwW5EKhh6dbGMds4WLon3Zw&per_page=1`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.results.length > 0) {
            const firstImage = data.results[0];
            setImageUrl(firstImage.urls.regular);
          } else {
            setError('No images found for this keyword.');
          }
        } catch (error) {
          console.error('Error fetching image from Unsplash:', error);
          setError('Failed to fetch images.');
        }
      };

      fetchImage();
    }
  }, [keyword]);  // Ensures that this effect runs only when the keyword changes

  return (
    <div className="unsplash-image-fetcher">
      {imageUrl ? <img src={imageUrl} alt={`Search result for ${keyword}`} /> : <p>{error || 'No image found'}</p>}
    </div>
  );
};

export default UnsplashImageFetcher;
