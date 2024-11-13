import React, { useState } from "react";
import Chatbot from "react-chatbot-kit";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";
import config from "./config";
import './ChatBotContainer.css'; // Import the CSS file

const ChatBotContainer = () => {
  const [showChatbot, setShowChatbot] = useState(false); // Start with chatbot closed

  // Function to toggle the chatbot visibility
  const toggleChatbot = () => {
    setShowChatbot((prevShowChatbot) => !prevShowChatbot); // Toggle chatbot visibility
  };

  return (
    <div>
      {/* Logo to toggle chatbot */}
      <img
     
        src="../../public/chatbot.png" // Replace with the actual path to your logo
        alt="Chatbot Logo"
        className="chatbot-toggle-logo"
        onClick={toggleChatbot}
      />

      {/* Show Chatbot only if showChatbot is true */}
      {showChatbot && (
        <div className="chatbot-container">
          {/* Chatbot Component */}
          <Chatbot
            config={config}
            actionProvider={(props) => (
              <ActionProvider {...props} closeChatbot={toggleChatbot} />
            )}
            messageParser={(props) => <MessageParser {...props} />}
          />
        </div>
      )}
    </div>
  );
};

export default ChatBotContainer;
