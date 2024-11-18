import React from 'react';
import FeatureBox from './FeatureBox';

const Features: React.FC = () => {
  return (
    <div className="features-container">
      <div className="feature-list">
            <FeatureBox title="User Profile" description="it has profile and everything else" />
            <FeatureBox title="User Profile" description="it has profile and everything else" />
            <FeatureBox title="Blog" description="Easy-to-use interface designed with the user in mind." />
            <FeatureBox title="Gallary art" description="Flexible settings to personalize your experience." />
            <FeatureBox title="Gallary art" description="Flexible settings to personalize your experience.lcbjlnck;kcpbpcbbcpbbbcebpbp" />
      </div>
    </div>
  );
};

export default Features;
