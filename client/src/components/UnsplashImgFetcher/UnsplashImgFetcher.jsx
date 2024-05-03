import React, { useState, useEffect } from 'react';
import './UnsplashImgFetcher.scss';

const UnsplashImageFetcher = ({ keyword, randomize = false }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Determine the page based on the randomize flag
    const updatePage = () => {
      if (randomize) {
        const totalPages = 30; // Assuming there could be at least 10 pages of results for most keywords
        const randomPage = Math.floor(Math.random() * totalPages) + 1; // Random page number between 1 and 10
        setPage(randomPage);
      } else {
        setPage(1); // Always fetch the first page
      }
    };

    updatePage();
  }, [keyword, randomize]);  // Reacts to changes in keyword or randomize flag

  useEffect(() => {
    if (keyword) {
      const fetchImage = async () => {
        try {
          const response = await fetch(
            `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=OMIS2C4i3UU3Q4RDwR5JkwW5EKhh6dbGMds4WLon3Zw&per_page=1`
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
  }, [keyword, page]);  // Reacts to changes in keyword or page

  return (
    <div className="unsplash-image-fetcher">
      {imageUrl ? <img src={imageUrl} alt={`Search result for ${keyword}`} /> : <p>{error || 'No image found'}</p>}
    </div>
  );
};

export default UnsplashImageFetcher;
