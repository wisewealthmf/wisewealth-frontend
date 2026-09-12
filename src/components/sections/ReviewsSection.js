import React, { useEffect, useRef } from "react";
import "./ReviewsSection.css";

const ReviewsSection = () => {
  const scrollRef = useRef(null);
  const interactionRef = useRef(false);
  const resumeTimeoutRef = useRef(null);

  const reviews = [
    {
      name: "Tanisha Shah",
      rating: 5,
      text: "The team is highly supportive and always ready to help resolve any issues. Also investment process is very smooth and transparent. ",
      location: "Management Executive at Yashvi Group ",
    },
    {
      name: "Rakesh Kumar Pal",
      rating: 5,
      text: "My experience with your services has been very positive, responsive & helpful throughout the process & handled effectively ",
      location: "Engineer",
    },
    {
      name: "Kushal Desai",
      rating: 5,
      text: "Mr. Niraj provide veey accurate and quick service to his clients. His tailor made portfolio according to clients requirement is most important thing that make him different from every mutual fund advisors.  Main key point to choose ",
      location: "Senior Manager at AMNS",
    },
    {
      name: "Amrut Shankarbhai Patel",
      rating: 5,
      text: "Service found satisfactory.I have received good gain again my portfolio.",
      location: "Retired",
    },
    {
      name: "Chaudhari Jay Ranjitkumar",
      rating: 4,
      text: "It's very good service with good connections with clients time to time",
      location: "Doctor",
    },
    {
      name: "Vipulkumar Panchal",
      rating: 5,
      text: "Always helpful and share his in-depth analysis and thoughts on investment. ",
      location: "Country: Bahrain",
    },
    {
      name: "Balbhadra Chauhan",
      rating: 5,
      text: "Very good 👍 ",
      location: "DGM at AMNS",
    },
  ];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollStep = 1;
    const scrollInterval = 30;

    const pauseAutoScroll = () => {
      interactionRef.current = true;
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = setTimeout(() => {
        interactionRef.current = false;
      }, 1200);
    };

    const resumeAutoScroll = () => {
      clearTimeout(resumeTimeoutRef.current);
      interactionRef.current = false;
    };

    const autoScroll = setInterval(() => {
      if (interactionRef.current) return;

      scrollContainer.scrollLeft += scrollStep;
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      }
    }, scrollInterval);

    scrollContainer.addEventListener("wheel", pauseAutoScroll, {
      passive: true,
    });
    scrollContainer.addEventListener("touchstart", pauseAutoScroll, {
      passive: true,
    });
    scrollContainer.addEventListener("pointerdown", pauseAutoScroll);
    scrollContainer.addEventListener("pointerup", resumeAutoScroll);
    scrollContainer.addEventListener("pointercancel", resumeAutoScroll);

    return () => {
      clearInterval(autoScroll);
      clearTimeout(resumeTimeoutRef.current);
      scrollContainer.removeEventListener("wheel", pauseAutoScroll);
      scrollContainer.removeEventListener("touchstart", pauseAutoScroll);
      scrollContainer.removeEventListener("pointerdown", pauseAutoScroll);
      scrollContainer.removeEventListener("pointerup", resumeAutoScroll);
      scrollContainer.removeEventListener("pointercancel", resumeAutoScroll);
    };
  }, []);

  const scrollToNextCard = (direction) => {
    const scrollContainer = scrollRef.current;
    const firstCard = scrollContainer?.querySelector(".review-card");
    if (!scrollContainer || !firstCard) return;

    interactionRef.current = true;
    clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      interactionRef.current = false;
    }, 1200);

    const track = firstCard.parentElement;
    const trackStyles = window.getComputedStyle(track);
    const cardGap = parseFloat(trackStyles.columnGap) || 24;
    const cardDistance = firstCard.getBoundingClientRect().width + cardGap;
    const currentCard = scrollContainer.scrollLeft / cardDistance;
    const targetCard = direction > 0
      ? Math.floor(currentCard + 0.01) + 1
      : Math.ceil(currentCard - 0.01) - 1;

    scrollContainer.scrollTo({
      left: Math.max(0, targetCard * cardDistance),
      behavior: "smooth",
    });
  };

  return (
    <section id="reviews" className="reviews-section section">
      <div className="container">
        <p className="section-title">Client's Review</p>
        <h2 className="section-heading">Don't Take My Word For It!</h2>
        <p className="section-subheading">Here it from my clients.</p>

        <div className="reviews-carousel">
          <button
            type="button"
            className="reviews-arrow"
            onClick={() => scrollToNextCard(-1)}
            aria-label="Previous review"
          >
            ←
          </button>

          <div className="reviews-scroll-container" ref={scrollRef}>
            <div className="reviews-track">
              {[...reviews, ...reviews].map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-stars">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="star">
                        ⭐
                      </span>
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

          <button
            type="button"
            className="reviews-arrow"
            onClick={() => scrollToNextCard(1)}
            aria-label="Next review"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
