import React from 'react';

const FormContainer = ({ title, children }) => {
  return (
    <div className="form-section">
              <img 
          src={"Logo1.png"} 
          alt="Form Logo" 
          className="form-image" 
        />
      <div className="custom-form-container">

        <h2 className="center-text" style={{fontWeight: "bolder"}} >{title}</h2>
        <hr />
        {children} {/* Render dynamic content passed from the parent */}
      </div>
    </div>
  );
};

export default FormContainer;
