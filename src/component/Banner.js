import React from "react";

function Banner() {
  return (
    <div className="dc-banners">
      <div className="dc-banner-text">
        <h2>
          Want to know the root cause of illness and various imbalances of the
          body and mind?
        </h2>
        <p>
          Don’t worry, we have got you covered. Kapiva has a team of experienced
          Ayurvedic practitioners and nutritionists who will guide you at every
          step to get healthy and fit in a natural way.
        </p>
        <p className="green">
          Get a 100% Private, Free Online Ayurvedic consultation.
        </p>
      </div>
      <div className="dc-banner-img">
        <img
          src="https://cdn11.bigcommerce.com/s-2qk49wb9fq/content/health-tech-doc-consult/img/banner.png"
          alt="image"
        />
      </div>
    </div>
  );
}

export default Banner;
