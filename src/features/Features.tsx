import React from 'react';
import FeatureBox from './FeatureBox';

const Features: React.FC = () => {
  return (
    <div className="features-container">
      <div className="feature-list">
        <div style={{ display: 'flex'}}>
            <FeatureBox title="User Profile" description="it has profile and everything else" />
                <div>
                    <FeatureBox title="Blog" description="Easy-to-use interface designed with the user in mind." />
                    <FeatureBox title="Gallary art" description="Flexible settings to personalize your experience." />
                </div>
            <FeatureBox title="User Profile" description="it has profile and everything else" />
            <FeatureBox title="Gallary art" description="Flexible settings to personalize your experience.lcbjlnck;kcpbpcbbcpbbbcebpbp" />
        </div>
      </div>
    </div>
  );
};

export default Features;
