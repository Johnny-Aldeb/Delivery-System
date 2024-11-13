import React from 'react'; // Add this import statement
import { createChatBotMessage } from 'react-chatbot-kit';
import Options from './Options'; // Import the Options component

const config = {
  botName: "DeliveryBot",
  initialMessages: [
    createChatBotMessage("What would you like to do?", {
      widget: "optionsWidget", // Reference the widget by name
    }),
  ],
  widgets: [
    {
      widgetName: "optionsWidget", // Name of the widget
      widgetFunc: (props) => {
        return React.createElement(Options, props); // Use React.createElement instead of JSX
      },
    },
  ],
};

export default config;
