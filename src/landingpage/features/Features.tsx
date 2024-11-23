import React from 'react';
import FeatureBox from './FeatureBox';

const Features: React.FC = () => {
  return (
    <div className="features-container">
      <div className="feature-list">
            <FeatureBox title="User Profile" description="The User Profile serves as a personalized space where users can manage their presence on the platform, whether as buyers, sellers, or both. It provides essential information and functionalities to enhance their experience and facilitate interactions." />
            <FeatureBox title="Registration User" description="The User Registration process is simple and user-friendly, allowing new users to quickly join the platform." />
            <FeatureBox title="Blog" description="Articles, news, and updates about art, hosted in the Blog Tab, covering topics such as painters, galleries, or related content." />
            <FeatureBox title="Ⅽategorization Artwork" description="Paintings are categorized based on style, type, color, region, artist, and title." />
            <FeatureBox title="Gallary art" description="The Galleries Tab showcases art galleries and allows users to explore curated collections or find more information about specific galleries." />
      </div>
    </div>
  );
};

export default Features;
