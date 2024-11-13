import React from 'react';

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    const lowerCaseMessage = message.toLowerCase();

    // Handle initial option selection
    if (lowerCaseMessage.includes("track package")) {
      actions.handleTrackPackageRequest();
    } else if (lowerCaseMessage.includes("Delivery Estimate")) {
      actions.handleTrackingEstimate();
    } else if (lowerCaseMessage.includes("Get Amount")) {
      actions.handleAmount();
    } else {
      // Handle user input for tracking number
      actions.handleUserInput(message);
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          parse: parse,
          actions,
        })
      )}
    </div>
  );
};

export default MessageParser;
