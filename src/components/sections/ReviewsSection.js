import React, { useEffect, useRef } from 'react';
import './ReviewsSection.css';

const ReviewsSection = () => {
  const scrollRef = useRef(null);

  const reviews = [
    {
      name: 'Tanisha Shah',
      rating: 5,
      text: 'The team is highly supportive and always ready to help resolve any issues. Also investment process is very smooth and transparent. ',
      location: 'Management Executive at Yashvi Group '
    },
    {
      name: 'Rakesh Kumar Pal',
      rating: 5,
      text: 'My experience with your services has been very positive, responsive & helpful throughout the process & handled effectively ',
      location: 'Engineer'
    },
    {
      name: 'Kushal Desai',
      rating: 5,
      text: 'Mr. Niraj provide veey accurate and quick service to his clients. His tailor made portfolio according to clients requirement is most important thing that make him different from every mutual fund advisors.  Main key point to choose ',
      location: 'Senior Manager at AMNS'
    },
    {
      name: 'Amrut Shankarbhai Patel',
      rating: 5,
      text: 'Service found satisfactory.I have received good gain again my portfolio.',
      location: 'Retired'
    },
    {
      name: 'Chaudhari Jay Ranjitkumar',
      rating: 4,
      text: 'It\'s very good service with good connections with clients time to time',
      location: 'Doctor'
    },
    {
      name: 'Vipulkumar Panchal',
      rating: 5,
      text: 'Always helpful and share his in-depth analysis and thoughts on investment. ',
      location: 'Country: Bahrain'
    },
    {
      name: 'Balbhadra Chauhan',
      rating: 5,
      text: 'Very good 👍 ',
      location: 'DGM at AMNS'
    }
  ];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollInterval = 30;

    const autoScroll = setInterval(() => {
      scrollAmount += scrollStep;
      scrollContainer.scrollLeft = scrollAmount;

      if (scrollAmount >= scrollContainer.scrollWidth / 2) {
        scrollAmount = 0;
      }
    }, scrollInterval);

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <section id="reviews" className="reviews-section section">
      <div className="container">
        <p className="section-title">Client's Review</p>
        <h2 className="section-heading">Don't Take My Word For It!</h2>
        <p className="section-subheading">Here it from my clients.</p>
        
        <div className="reviews-scroll-container" ref={scrollRef}>
          <div className="reviews-track">
            {[...reviews, ...reviews].map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-stars">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <p className="review-text">"{review.text}"</p>
                <div
  className="review-author"
  data-initial={review.name.charAt(0)}
>
  <div className="author-details">
    <p className="author-name">{review.name}</p>
    <p className="author-location">{review.location}</p>
  </div>
</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

// Made with Bob
