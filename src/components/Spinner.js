import React from 'react';

const Spinner = ({isSpinning}) => {
  var renderSpinner = (
    <div className="loader">
    </div>
  );
  return isSpinning ? renderSpinner : null;
};

export default Spinner;