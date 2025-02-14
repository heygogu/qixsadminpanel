export const text =
  "(function () {" +
  "  // Create style element" +
  '  const style = document.createElement("style");' +
  "  style.textContent = `" +
  "      :root {" +
  "          --primary-color: #181c67;" +
  "          --primary-light: #DBEAFE;" +
  "          --secondary-color:rgb(239, 244, 252);" +
  "          --error-color: #EF4444;" +
  "          --success-color: #10B981;" +
  "          --text-color: #1F2937;" +
  "          --light-text: #6B7280;" +
  "          --border-radius: 20px;" +
  "          --message-radius: 20px;" +
  "      }" +
  "  " +
  "      .chat-container {" +
  "          position: fixed;" +
  "          bottom: 24px;" +
  "          right: 24px;" +
  "          width: 400px;" +
  "          height: 590px;" +
  "          background: white;" +
  "          z-index: 1000;" +
  "          border-radius: var(--border-radius);" +
  "          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);" +
  "          display: none;" +
  "          flex-direction: column;" +
  "          overflow: hidden;" +
  "          font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;" +
  "          font-size: 13px;" +
  "      }" +
  "" +
  "      #userDetailsForm{" +
  "        padding:0;" +
  "          text-align: start;" +
  "          width:100%" +
  "    }" +
  "  " +
  "      .chat-header {" +
  "          background: var(--primary-color);" +
  "          color: white;" +
  "          padding: 13px 0px;" +
  "         " +
  "        height: 35px;" +
  "          padding-left:10px;" +
  "          padding-top:17px;" +
  "          font-weight: 600;" +
  "          display: flex;" +
  "          font-size: 16px;" +
  "          justify-content: space-between;" +
  "          align-items: center;" +
  "          border-bottom: 1px solid rgba(255, 255, 255, 0.1);" +
  "      }" +
  "  " +
  "      .chat-header-title {" +
  "          display: flex;" +
  "          align-items: center;" +
  "          gap: 10px;" +
  "      }" +
  "  " +
  "      .chat-messages {" +
  "          flex: 1;" +
  "          overflow-y: auto;" +
  "          padding: 15px;" +
  "        " +
  "          " +
  "          scroll-behavior: smooth;" +
  "      }" +
  "      .chat-messages::-webkit-scrollbar-thumb {" +
  "           display:none !important" +
  "        }" +
  "" +
  "      .setup-container {" +
  "          background: white;" +
  "          border-radius: var(--border-radius);" +
  "          padding:20px;" +
  "          padding-top:30px;" +
  "          padding-bottom:30px;" +
  "          display: flex;" +
  "          margin-top:40px;" +
  "          margin-left:7px;" +
  "            margin-right:7px;" +
  "            flex-direction: column;" +
  "            justify-content: center;" +
  "            align-items: center;" +
  "         " +
  "         " +
  "          text-align: center;" +
  "         " +
  "         " +
  "         " +
  "          box-shadow: 0 0px 51px rgba(0, 0, 0, 0.09);" +
  "      }" +
  "  " +
  "      .setup-title {" +
  "          color: var(--text-color);" +
  "          text-align: start;" +
  "          margin-bottom: 20px;" +
  "          font-size: 16px;" +
  "         " +
  "      }" +
  "  " +
  "      .setup-description {" +
  "          color: var(--light-text);" +
  "          margin-bottom: 20px;" +
  "          font-size: 13px;" +
  "          line-height: 1.5;" +
  "      }" +
  "" +
  "      .form-group {" +
  "          margin-bottom: 16px;" +
  "      }" +
  "" +
  "      .form-label {" +
  "          display: block;" +
  "          align:start;" +
  "          margin-bottom: 6px;" +
  "          color: var(--text-color);" +
  "          font-size: 15px;" +
  "      }" +
  "" +
  "      .form-input {" +
  "          width:-webkit-fill-available;" +
  "          padding: 13px 11px;" +
  "          border: 1px solid #E5E7EB;" +
  "          border-radius: 9px;" +
  "          font-size: 13.5px;" +
  "          color:black;" +
  "          transition: all 0.2s;" +
  "      }" +
  "" +
  "      .form-input:focus {" +
  "          outline: none;" +
  "          border-color: var(--primary-color);" +
  "          box-shadow: 0 0 0 3px var(--primary-light);" +
  "      }" +
  "      " +
  "      .form-input{" +
  "      color:black;" +
  "      }" +
  "      .country-select-container {" +
  "          position: relative;" +
  "          border: 1px solid #E5E7EB;" +
  "          border-radius: 8px;" +
  "      }" +
  "    " +
  "      .country-select {" +
  "          width: 100%;" +
  "          " +
  "          padding: 8px 12px;" +
  "          font-size: 13px;" +
  "          transition: all 0.2s;" +
  "         " +
  "          cursor: pointer;" +
  "      }" +
  "" +
  "      select{" +
  "      border:none !important;" +
  "      border-radius:50px !important;" +
  "      }" +
  "" +
  "" +
  "      .country-options {" +
  "          position: absolute;" +
  "          top: 100%;" +
  "          left: 0;" +
  "          right: 0;" +
  "          background: white;" +
  "         " +
  "          border-radius: 8px;" +
  "          max-height: 200px;" +
  "          overflow-y: auto;" +
  "          display: none;" +
  "          z-index: 1000;" +
  "      }" +
  "" +
  "      .country-option {" +
  "          padding: 8px 12px;" +
  "          cursor: pointer;" +
  "      }" +
  "" +
  "     " +
  "" +
  "      .setup-button {" +
  "          background: var(--primary-color);" +
  "          color: white;" +
  "          border: none;" +
  "          font-size: 18px;" +
  "          padding: 15px 20px;" +
  "          border-radius: 13px;" +
  "          cursor: pointer;" +
  "          font-weight: 500;" +
  "          width: 100%;" +
  "          transition: all 0.2s;" +
  "        " +
  "          font-size: 14px;" +
  "          font-weight: 600;" +
  "      }" +
  "  " +
  "   " +
  "  " +
  "      .chat-header-title svg {" +
  "          width: 24px;" +
  "          height: 24px;" +
  "      }" +
  "  " +
  "      .chat-header-status {" +
  "          font-size: 13px;" +
  "          opacity: 0.9;" +
  "          font-weight: normal;" +
  "      }" +
  "  " +
  "     " +
  "      .chat-messages::-webkit-scrollbar {" +
  "          width: 6px;" +
  "      }" +
  "  " +
  "      .chat-messages::-webkit-scrollbar-track {" +
  "          background: transparent;" +
  "      }" +
  "  " +
  "      .chat-messages::-webkit-scrollbar-thumb {" +
  "          background: #E5E7EB;" +
  "          border-radius: 3px;" +
  "      }" +
  "  " +
  "      .message {" +
  "          margin-bottom: 1px;" +
  "          max-width: 68%;" +
  "          padding: 13px 18px;" +
  "          border-radius: var(--message-radius);" +
  "          word-wrap: break-word;" +
  "          position: relative;" +
  "          animation: messageSlide 0.3s ease;" +
  "          line-height: 1.5;" +
  "          font-size: 14px;" +
  "      }" +
  "  " +
  "      .message-timestamp {" +
  "          font-size: 11px;" +
  "       " +
  "          margin-top: 4px;" +
  "          opacity: 0.8;" +
  "          text-align:end;" +
  "      }" +
  "" +
  "      .user-message-timestamp{" +
  "         font-size:11px;" +
  "            margin-top:4px;" +
  "            opacity:0.8;" +
  "            text-align:end;" +
  "" +
  "      }" +
  "          #userInput{" +
  "          color:black;" +
  "           box-shadow: 0 2px 18px rgba(0, 0, 0, 0.2);" +
  "           padding: 17px 16px;" +
  "          }" +
  "  " +
  "       @keyframes messageSlide {" +
  "                from {" +
  "                        opacity: 0;" +
  "                        transform: translateY(5px); // reduced from 10px to 5px for subtler movement" +
  "                }" +
  "                to {" +
  "                        opacity: 1;" +
  "                        transform: translateY(0);" +
  "                }" +
  "        }" +
  "  " +
  "      .user-message {" +
  "          background: var(--secondary-color);" +
  "          color:black;" +
  "          margin-left: auto;" +
  "          border-radius: var(--message-radius) 0 var(--message-radius) var(--message-radius);" +
  "      }" +
  "  " +
  "      .user-message .message-timestamp {" +
  "          color: rgba(255, 255, 255, 0.8);" +
  "          text-align: right;" +
  "      }" +
  "  " +
  "      .bot-message {" +
  "          background: var(--primary-color);" +
  "          color: white;" +
  "          margin-right: auto;" +
  "          border-radius: 0 var(--message-radius) var(--message-radius) var(--message-radius) ;" +
  "          border: 1px solid #E5E7EB;" +
  "      }" +
  "  " +
  "      .error-message {" +
  "          background: #FEF2F2;" +
  "          color: var(--error-color);" +
  "          text-align: center;" +
  "          padding: 12px;" +
  "          margin: 10px 20px;" +
  "          border-radius: var(--border-radius);" +
  "          font-size: 14px;" +
  "          border: 1px solid #FEE2E2;" +
  "          animation: shake 0.5s ease;" +
  "      }" +
  "  " +
  "      @keyframes shake {" +
  "          0%, 100% { transform: translateX(0); }" +
  "          25% { transform: translateX(-5px); }" +
  "          75% { transform: translateX(5px); }" +
  "      }" +
  "  " +
  "      .typing-indicator {" +
  "          display: none;" +
  "          background: var(--primary-color);" +
  "          border-radius:0 var(--message-radius) var(--message-radius) var(--message-radius) ;" +
  "          padding: 12px;" +
  "          margin-bottom: 16px;" +
  "          width: fit-content;" +
  "          animation: messageSlide 0.3s ease;" +
  "      }" +
  "" +
  "      .feedbackmsg{" +
  "      color:black;}" +
  "  " +
  "      .typing-indicator span {" +
  "          display: inline-block;" +
  "          width: 6px;" +
  "          height: 6px;" +
  "          background:white;" +
  "          border-radius: 50%;" +
  "          margin-right: 5px;" +
  "          opacity: 0.6;" +
  "          animation: typing 1s infinite;" +
  "      }" +
  "  " +
  "      .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }" +
  "      .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }" +
  "  " +
  "      @keyframes typing {" +
  "          0%, 100% { transform: translateY(0); }" +
  "          50% { transform: translateY(-5px); }" +
  "      }" +
  "  " +
  "      .chat-input {" +
  "          display: flex;" +
  "          align-items: center;" +
  "          padding: 18px;" +
  "          background: white;" +
  "          gap: 12px;" +
  "      }" +
  "  " +
  "      .chat-input-wrapper {" +
  "          flex: 1;" +
  "          position: relative;" +
  "      }" +
  "  " +
  "      .chat-input input {" +
  "          width: 100%;" +
  "          padding: 12px 44px 12px 16px;" +
  "          border: 1px solid #E5E7EB;" +
  "          border-radius: 15px;" +
  "          font-size: 14px;" +
  "          transition: all 0.2s;" +
  "          " +
  "      }" +
  "  " +
  "      .chat-input input:focus {" +
  "          outline: none;" +
  "          border-color: var(--primary-color);" +
  "          background: white;" +
  "          box-shadow: 0 0 0 3px var(--primary-light);" +
  "      }" +
  "  " +
  "      .chat-input button {" +
  "          padding: 0px !important;" +
  "          background: var(--primary-color) !important;" +
  "          color: white !important;" +
  "          border: none !important;" +
  "          border-radius: 50% !important;" +
  "          cursor: pointer !important;" +
  "          font-weight: 500 !important;" +
  "          transition: all 0.2s !important;" +
  "          display: flex !important;" +
  "          align-items: center !important;" +
  "          justify-content: center !important;" +
  "         " +
  "          min-width: 47px !important;" +
  "          min-height: 47px !important;" +
  "      }" +
  "  " +
  "      .chat-input button:hover {" +
  "          " +
  "          transform: scale(1.09);" +
  "      }" +
  "  " +
  "      .chat-input button:active {" +
  "          transform: scale(0.95);" +
  "      }" +
  "  " +
  "      .chat-trigger {" +
  "          position: fixed !important;" +
  "          bottom: 24px !important;" +
  "          right: 24px !important;" +
  "          width: 64px !important;" +
  "          height: 64px !important;" +
  "          background:var(--primary-color) !important;" +
  "          border-radius: 50% !important;" +
  "          display: flex !important;" +
  "          align-items: center !important;" +
  "          justify-content: center !important;" +
  "          cursor: pointer !important;" +
  "          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25) !important;" +
  "          z-index: 9999 !important;" +
  "          transition: all 0.2s !important;" +
  "      }" +
  "  " +
  "      .chat-container {" +
  "          z-index: 10000 !important;" +
  "      }" +
  "  " +
  "      .chat-trigger:hover {" +
  "          transform: scale(1.05);" +
  "          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.35);" +
  "      }" +
  "  " +
  "      .chat-trigger svg {" +
  "          width: 28px;" +
  "          height: 28px;" +
  "          color: white;" +
  "      }" +
  "  " +
  "      .close-btn {" +
  "          background: none;" +
  "          border: none;" +
  "          color: white;" +
  "          cursor: pointer;" +
  "          padding: 8px 10px;" +
  "          margin-right:8px;" +
  "          opacity: 0.8;" +
  "          transition: all 0.2s;" +
  "          border-radius: 50%;" +
  "      }" +
  "  " +
  "      .close-btn:hover {" +
  "          opacity: 1;" +
  "          background: rgba(255, 255, 255, 0.1);" +
  "      }" +
  "  " +
  "   " +
  "  " +
  "     " +
  "  " +
  "      .setup-description {" +
  "          color: var(--light-text);" +
  "          margin-bottom: 24px;" +
  "          font-size: 14px;" +
  "          line-height: 1.5;" +
  "      }" +
  "  " +
  "      .setup-input {" +
  "          width: 80%;" +
  "          padding: 12px 10px;" +
  "          margin-bottom: 16px;" +
  "          border: 1px solid #E5E7EB;" +
  "          border-radius: var(--border-radius);" +
  "          font-size: 14px;" +
  "          transition: all 0.2s;" +
  "      }" +
  "  " +
  "      .setup-input:focus {" +
  "          outline: none;" +
  "          border-color: var(--primary-color);" +
  "          box-shadow: 0 0 0 3px var(--primary-light);" +
  "      }" +
  "  " +
  "    " +
  "      .conversation-end-buttons {" +
  "          display: flex;" +
  "          gap: 8px;" +
  "          margin-top: 8px;" +
  "      }" +
  "      " +
  "      .btn-container{" +
  "          display: flex;" +
  "          justify-content: center;" +
  "          align-items: center;" +
  "          text-align: center;" +
  "          " +
  "          }" +
  "      .conversation-end-button {" +
  "          padding: 6px 12px;" +
  "          border-radius: 16px;" +
  "          border: 1px solid var(--primary-color);" +
  "          background: white;" +
  "          color: var(--primary-color);" +
  "          cursor: pointer;" +
  "          transition: all 0.2s;" +
  "          font-size: 12px;" +
  "      }" +
  "  " +
  "      .feedback-button:hover {" +
  "          background: var(--primary-light);" +
  "      }" +
  "    .chatbot-header{" +
  "    display:flex;" +
  "    align-items:center;" +
  "    }" +
  "    `;" +
  "  document.head.appendChild(style);" +
  "  const countryCodesStyle = `" +
  "    .country-select-container {" +
  "        display: flex;" +
  "        gap: 10px;" +
  "        align-items: center;" +
  "        " +
  "        }" +
  "        .country-select-container:focus {" +
  "            outline:none !important;" +
  "            border-color:var(--primary-color);" +
  "            box-shadow:0 0 0 3px var(--primary-light);" +
  "        " +
  "        }" +
  "            " +
  "" +
  "    .phonee{" +
  "    border:none !important;" +
  "    focus:none !important;" +
  "    outline:none !important;" +
  "    box-shadow:none !important;" +
  "" +
  "    }" +
  "    .country-code-select {" +
  "        width: 60px;" +
  "        margin-left:5px;" +
  "        margin-bottom:0px;" +
  "         border: 1px solid #E5E7EB;" +
  "         outline:none;" +
  "        border-radius: 8px;" +
  "        font-size: 13px;" +
  "        background: white;" +
  "    }" +
  "    `;" +
  "  style.textContent += countryCodesStyle;" +
  "" +
  "  const countryCodes = [" +
  '    { code: "+1", country: "United States" },' +
  '    { code: "+91", country: "India" },' +
  '    { code: "+44", country: "United Kingdom" },' +
  '    { code: "+86", country: "China" },' +
  '    { code: "+81", country: "Japan" },' +
  '    { code: "+61", country: "Australia" },' +
  '    { code: "+49", country: "Germany" },' +
  '    { code: "+33", country: "France" },' +
  '    { code: "+7", country: "Russia" },' +
  '    { code: "+65", country: "Singapore" },' +
  '    { code: "+93", country: "Afghanistan" },' +
  '    { code: "+355", country: "Albania" },' +
  '    { code: "+213", country: "Algeria" },' +
  '    { code: "+376", country: "Andorra" },' +
  '    { code: "+244", country: "Angola" },' +
  '    { code: "+54", country: "Argentina" },' +
  '    { code: "+374", country: "Armenia" },' +
  '    { code: "+297", country: "Aruba" },' +
  '    { code: "+43", country: "Austria" },' +
  '    { code: "+994", country: "Azerbaijan" },' +
  '    { code: "+973", country: "Bahrain" },' +
  '    { code: "+880", country: "Bangladesh" },' +
  '    { code: "+375", country: "Belarus" },' +
  '    { code: "+32", country: "Belgium" },' +
  '    { code: "+501", country: "Belize" },' +
  '    { code: "+229", country: "Benin" },' +
  '    { code: "+975", country: "Bhutan" },' +
  '    { code: "+591", country: "Bolivia" },' +
  '    { code: "+387", country: "Bosnia and Herzegovina" },' +
  '    { code: "+267", country: "Botswana" },' +
  '    { code: "+55", country: "Brazil" },' +
  '    { code: "+673", country: "Brunei" },' +
  '    { code: "+359", country: "Bulgaria" },' +
  '    { code: "+226", country: "Burkina Faso" },' +
  '    { code: "+257", country: "Burundi" },' +
  '    { code: "+855", country: "Cambodia" },' +
  '    { code: "+237", country: "Cameroon" },' +
  '    { code: "+1", country: "Canada" },' +
  '    { code: "+238", country: "Cape Verde" },' +
  '    { code: "+236", country: "Central African Republic" },' +
  '    { code: "+235", country: "Chad" },' +
  '    { code: "+56", country: "Chile" },' +
  '    { code: "+57", country: "Colombia" },' +
  '    { code: "+269", country: "Comoros" },' +
  '    { code: "+243", country: "Congo (DRC)" },' +
  '    { code: "+242", country: "Congo (Republic)" },' +
  '    { code: "+506", country: "Costa Rica" },' +
  '    { code: "+385", country: "Croatia" },' +
  '    { code: "+53", country: "Cuba" },' +
  '    { code: "+357", country: "Cyprus" },' +
  '    { code: "+420", country: "Czech Republic" },' +
  '    { code: "+45", country: "Denmark" },' +
  '    { code: "+253", country: "Djibouti" },' +
  '    { code: "+670", country: "East Timor" },' +
  '    { code: "+593", country: "Ecuador" },' +
  '    { code: "+20", country: "Egypt" },' +
  '    { code: "+503", country: "El Salvador" },' +
  '    { code: "+240", country: "Equatorial Guinea" },' +
  '    { code: "+291", country: "Eritrea" },' +
  '    { code: "+372", country: "Estonia" },' +
  '    { code: "+251", country: "Ethiopia" },' +
  '    { code: "+679", country: "Fiji" },' +
  '    { code: "+358", country: "Finland" },' +
  '    { code: "+33", country: "France" },' +
  '    { code: "+241", country: "Gabon" },' +
  '    { code: "+220", country: "Gambia" },' +
  '    { code: "+995", country: "Georgia" },' +
  '    { code: "+49", country: "Germany" },' +
  '    { code: "+233", country: "Ghana" },' +
  '    { code: "+30", country: "Greece" },' +
  '    { code: "+299", country: "Greenland" },' +
  '    { code: "+502", country: "Guatemala" },' +
  '    { code: "+224", country: "Guinea" },' +
  '    { code: "+245", country: "Guinea-Bissau" },' +
  '    { code: "+592", country: "Guyana" },' +
  '    { code: "+509", country: "Haiti" },' +
  '    { code: "+504", country: "Honduras" },' +
  '    { code: "+852", country: "Hong Kong" },' +
  '    { code: "+36", country: "Hungary" },' +
  '    { code: "+354", country: "Iceland" },' +
  '    { code: "+62", country: "Indonesia" },' +
  '    { code: "+98", country: "Iran" },' +
  '    { code: "+964", country: "Iraq" },' +
  '    { code: "+353", country: "Ireland" },' +
  '    { code: "+972", country: "Israel" },' +
  '    { code: "+39", country: "Italy" },' +
  '    { code: "+225", country: "Ivory Coast" },' +
  '    { code: "+1876", country: "Jamaica" },' +
  '    { code: "+81", country: "Japan" },' +
  '    { code: "+962", country: "Jordan" },' +
  '    { code: "+7", country: "Kazakhstan" },' +
  '    { code: "+254", country: "Kenya" },' +
  '    { code: "+686", country: "Kiribati" },' +
  '    { code: "+965", country: "Kuwait" },' +
  '    { code: "+996", country: "Kyrgyzstan" },' +
  '    { code: "+856", country: "Laos" },' +
  '    { code: "+371", country: "Latvia" },' +
  '    { code: "+961", country: "Lebanon" },' +
  '    { code: "+266", country: "Lesotho" },' +
  '    { code: "+231", country: "Liberia" },' +
  '    { code: "+218", country: "Libya" },' +
  '    { code: "+423", country: "Liechtenstein" },' +
  '    { code: "+370", country: "Lithuania" },' +
  '    { code: "+352", country: "Luxembourg" },' +
  '    { code: "+853", country: "Macau" },' +
  '    { code: "+389", country: "Macedonia" },' +
  '    { code: "+261", country: "Madagascar" },' +
  '    { code: "+265", country: "Malawi" },' +
  '    { code: "+60", country: "Malaysia" },' +
  '    { code: "+960", country: "Maldives" },' +
  '    { code: "+223", country: "Mali" },' +
  '    { code: "+356", country: "Malta" },' +
  '    { code: "+692", country: "Marshall Islands" },' +
  '    { code: "+222", country: "Mauritania" },' +
  '    { code: "+230", country: "Mauritius" },' +
  '    { code: "+52", country: "Mexico" },' +
  '    { code: "+691", country: "Micronesia" },' +
  '    { code: "+373", country: "Moldova" },' +
  '    { code: "+377", country: "Monaco" },' +
  '    { code: "+976", country: "Mongolia" },' +
  '    { code: "+382", country: "Montenegro" },' +
  '    { code: "+212", country: "Morocco" },' +
  '    { code: "+258", country: "Mozambique" },' +
  '    { code: "+95", country: "Myanmar" },' +
  '    { code: "+264", country: "Namibia" },' +
  '    { code: "+674", country: "Nauru" },' +
  '    { code: "+977", country: "Nepal" },' +
  '    { code: "+31", country: "Netherlands" },' +
  '    { code: "+64", country: "New Zealand" },' +
  '    { code: "+505", country: "Nicaragua" },' +
  '    { code: "+227", country: "Niger" },' +
  '    { code: "+234", country: "Nigeria" },' +
  '    { code: "+47", country: "Norway" },' +
  '    { code: "+968", country: "Oman" },' +
  '    { code: "+92", country: "Pakistan" },' +
  '    { code: "+680", country: "Palau" },' +
  '    { code: "+970", country: "Palestine" },' +
  '    { code: "+507", country: "Panama" },' +
  '    { code: "+675", country: "Papua New Guinea" },' +
  '    { code: "+595", country: "Paraguay" },' +
  '    { code: "+51", country: "Peru" },' +
  '    { code: "+63", country: "Philippines" },' +
  '    { code: "+48", country: "Poland" },' +
  '    { code: "+351", country: "Portugal" },' +
  '    { code: "+974", country: "Qatar" },' +
  '    { code: "+40", country: "Romania" },' +
  '    { code: "+7", country: "Russia" },' +
  '    { code: "+250", country: "Rwanda" },' +
  '    { code: "+685", country: "Samoa" },' +
  '    { code: "+378", country: "San Marino" },' +
  '    { code: "+239", country: "Sao Tome and Principe" },' +
  '    { code: "+966", country: "Saudi Arabia" },' +
  '    { code: "+221", country: "Senegal" },' +
  '    { code: "+381", country: "Serbia" },' +
  '    { code: "+248", country: "Seychelles" },' +
  '    { code: "+232", country: "Sierra Leone" },' +
  '    { code: "+65", country: "Singapore" },' +
  '    { code: "+421", country: "Slovakia" },' +
  '    { code: "+386", country: "Slovenia" },' +
  '    { code: "+677", country: "Solomon Islands" },' +
  '    { code: "+252", country: "Somalia" },' +
  '    { code: "+27", country: "South Africa" },' +
  '    { code: "+82", country: "South Korea" },' +
  '    { code: "+211", country: "South Sudan" },' +
  '    { code: "+34", country: "Spain" },' +
  '    { code: "+94", country: "Sri Lanka" },' +
  '    { code: "+249", country: "Sudan" },' +
  '    { code: "+597", country: "Suriname" },' +
  '    { code: "+268", country: "Swaziland" },' +
  '    { code: "+46", country: "Sweden" },' +
  '    { code: "+41", country: "Switzerland" },' +
  '    { code: "+963", country: "Syria" },' +
  '    { code: "+886", country: "Taiwan" },' +
  '    { code: "+992", country: "Tajikistan" },' +
  '    { code: "+255", country: "Tanzania" },' +
  '    { code: "+66", country: "Thailand" },' +
  '    { code: "+228", country: "Togo" },' +
  '    { code: "+676", country: "Tonga" },' +
  '    { code: "+216", country: "Tunisia" },' +
  '    { code: "+90", country: "Turkey" },' +
  '    { code: "+993", country: "Turkmenistan" },' +
  '    { code: "+688", country: "Tuvalu" },' +
  '    { code: "+256", country: "Uganda" },' +
  '    { code: "+380", country: "Ukraine" },' +
  '    { code: "+971", country: "United Arab Emirates" },' +
  '    { code: "+44", country: "United Kingdom" },' +
  '    { code: "+1", country: "United States" },' +
  '    { code: "+598", country: "Uruguay" },' +
  '    { code: "+998", country: "Uzbekistan" },' +
  '    { code: "+678", country: "Vanuatu" },' +
  '    { code: "+58", country: "Venezuela" },' +
  '    { code: "+84", country: "Vietnam" },' +
  '    { code: "+967", country: "Yemen" },' +
  '    { code: "+260", country: "Zambia" },' +
  '    { code: "+263", country: "Zimbabwe" },' +
  "  ];" +
  "  // Create HTML elements" +
  "  const chatHTML = `" +
  '     <div class="chat-trigger">' +
  '        <svg xmlns="http://www.w3.org/2000/svg" fill="var(--primary-color)" viewBox="0 0 24 24" stroke="currentColor">' +
  '          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />' +
  "        </svg>" +
  "      </div>" +
  "  " +
  '      <div class="chat-container" id="chatContainer">' +
  '          <div class="chat-header">' +
  '            <div class="chatbot-header">QIXS AI</div>' +
  '            <button class="close-btn">X</button>' +
  "        </div>" +
  '        <div class="chat-messages" id="chatMessages">' +
  '            <div class="typing-indicator" id="typingIndicator">' +
  "                <span></span>" +
  "                <span></span>" +
  "                <span></span>" +
  "            </div>" +
  "        </div>" +
  '        <div class="chat-input">' +
  '            <input type="text" id="userInput" placeholder="Send a message..." disabled>' +
  "           " +
  '        <button id="sendButton" disabled>' +
  '           <svg width="46" height="46" viewBox="0 0 46 46" fill="var(--primary-color)" xmlns="http://www.w3.org/2000/svg">' +
  '<rect width="46" height="46" rx="23" fill="#181C67"/>' +
  '<path d="M27.5343 13.0989L17.6443 16.3846C10.9962 18.6079 10.9962 22.2332 17.6443 24.4456L20.5795 25.4203L21.5543 28.3556C23.7667 35.0036 27.4028 35.0036 29.6152 28.3556L32.9119 18.4765C34.3795 14.0408 31.97 11.6203 27.5343 13.0989ZM27.8847 18.9913L23.7228 23.1751C23.5586 23.3394 23.3505 23.416 23.1424 23.416C22.9343 23.416 22.7262 23.3394 22.5619 23.1751C22.2443 22.8575 22.2443 22.3317 22.5619 22.0141L26.7238 17.8303C27.0414 17.5127 27.5671 17.5127 27.8847 17.8303C28.2024 18.1479 28.2024 18.6736 27.8847 18.9913Z" fill="white"/>' +
  "</svg>" +
  "" +
  "        </button>" +
  "        </div>" +
  "      </div>" +
  "    `;" +
  "" +
  "  // Create container for chatbot" +
  '  const chatbotContainer = document.createElement("div");' +
  "  chatbotContainer.innerHTML = chatHTML;" +
  "  document.body.appendChild(chatbotContainer);" +
  "" +
  "  function getApiKeyFromScript() {" +
  "    const scripts = Array.from(" +
  "      document.querySelectorAll('script[src*=\"chatbot.js\"]')" +
  "    );" +
  "    const currentScript = scripts[scripts.length - 1];" +
  "    const url = new URL(currentScript.src);" +
  "" +
  "    return {" +
  '      ai_agent: url.searchParams.get("ai_agent"),' +
  '      secret_key: url.searchParams.get("secret_key"),' +
  "    };" +
  "  }" +
  "" +
  "  // Initialize widget with API key from URL" +
  "  const { ai_agent, secret_key } = getApiKeyFromScript();" +
  "" +
  "  if (ai_agent && secret_key) {" +
  "    // Store API key" +
  '    localStorage.setItem("secret_key", secret_key);' +
  '    localStorage.setItem("ai_agent", ai_agent);' +
  "    this.secret_key = secret_key;" +
  "    this.agent_id = ai_agent;" +
  "  }" +
  "" +
  "  class ChatBot {" +
  "    constructor() {" +
  '      this.secret_key = localStorage.getItem("secret_key");' +
  '      this.agent_id = localStorage.getItem("ai_agent");' +
  '      this.apiEndpoint = "https://qixs.ai:3001/";' +
  "      this.initialized = false;" +
  "      this.messageHistory = [];" +
  "      this.chatId = null;" +
  "      this.userDetails = null;" +
  "      this.pendingUserDetails = null;" +
  "      this.agent_photo = null;" +
  "      this.agent_name = null;" +
  "    }" +
  "" +
  "    async validateApiKey(apiKey) {" +
  "      // For demo purposes" +
  "      return true;" +
  "    }" +
  "" +
  "    async submitUserDetails(details) {" +
  "      // For demo purposes" +
  "      this.userDetails = details;" +
  '      const chatMessages = document.getElementById("chatMessages");' +
  "      if (chatMessages) {" +
  "        // Clear existing messages first" +
  "        chatMessages.innerHTML = `" +
  '                    <div class="typing-indicator" id="typingIndicator">' +
  "                        <span></span>" +
  "                        <span></span>" +
  "                        <span></span>" +
  "                    </div>" +
  "                `;" +
  "" +
  "        // Add welcome message after a short delay to show animation" +
  "" +
  "        const response = await fetch(" +
  "          `${this.apiEndpoint}agent/${this.agent_id}`," +
  "          {" +
  '            method: "GET",' +
  "            headers: {" +
  '              "Content-Type": "application/json",' +
  "            }," +
  "          }" +
  "        );" +
  "" +
  "        if (response.ok) {" +
  "          const apiRes = await response.json();" +
  "          const firstMessage = apiRes.data.chat_first_message;" +
  "          this.agent_name = apiRes.data.name;" +
  "          this.agent_photo = apiRes.data.image;" +
  '          const chatbotHeader = document.querySelector(".chatbot-header");' +
  "          chatbotHeader.innerHTML = `" +
  '                        <img src="https://demoserver3.sgp1.digitaloceanspaces.com/uploads/images/original/${this.agent_photo}" alt="Agent" style="width: 35px; height: 35px; border-radius: 50%; margin-right: 8px; object-fit:cover; ">' +
  "                        <span>${apiRes?.data?.name}</span>" +
  "                    `;" +
  "          this.addMessage(firstMessage, false);" +
  "        } else {" +
  '          console.error("Failed to fetch first message");' +
  "        }" +
  "        // setTimeout(() => {" +
  "        //     this.addMessage('Hello! How can I help you today?', false);" +
  "        // }, 300);" +
  "      }" +
  "      return true;" +
  "    }" +
  "" +
  "    showUserForm() {" +
  "      // Generate country code options" +
  "      const countryCodeOptions = countryCodes" +
  "        .map(" +
  "          (cc) =>" +
  '            `<option value="${cc.code}">${cc.code} (${cc.country})</option>`' +
  "        )" +
  '        .join("");' +
  "" +
  "      const formHtml = `" +
  '                <div class="setup-container">' +
  "                " +
  '                    <form id="userDetailsForm">' +
  '                        <div class="form-group">' +
  '                            <label class="form-label">Your name <span style="color: red;">*</span></label>' +
  '                            <input type="text" class="form-input" name="name" placeholder="Enter your name">' +
  "                        </div>" +
  '                        <div class="form-group">' +
  '                            <label class="form-label">Email address <span style="color: red;">*</span></label>' +
  '                            <input type="email" class="form-input" name="email" placeholder="Enter your email" required>' +
  "                        </div>" +
  '                        <div class="form-group">' +
  '                            <label class="form-label">Phone number</label>' +
  '                            <div class="country-select-container">' +
  '                                <select class="country-code-select" name="country_code">' +
  "                                    ${countryCodeOptions}" +
  "                                </select>" +
  '                                <input type="tel" class="phonee form-input" name="phone" placeholder="Enter your phone number" style="flex:1; width:133px;">' +
  "                            </div>" +
  "                        </div>" +
  "                       " +
  '                        <div class="btn-container">' +
  '                            <button type="submit" class="setup-button">Start Chat</button>' +
  "                        </div>" +
  "                    </form>" +
  "                </div>" +
  "            `;" +
  "" +
  '      const chatMessages = document.getElementById("chatMessages");' +
  "      if (chatMessages) {" +
  "        chatMessages.innerHTML = formHtml;" +
  "        this.setupFormListeners();" +
  "      }" +
  "    }" +
  "" +
  "    setupFormListeners() {" +
  '      const form = document.getElementById("userDetailsForm");' +
  "" +
  "      if (form) {" +
  '        form.addEventListener("submit", async (e) => {' +
  "          e.preventDefault();" +
  "          const formData = new FormData(form);" +
  "          const details = Object.fromEntries(formData.entries());" +
  "" +
  "          // Normalize details" +
  "          const normalizedDetails = {" +
  "            name: details.name || null," +
  "            email: details.email || null," +
  "            phone_no: details.phone || null," +
  "            country_code: details.country_code || null," +
  "          };" +
  "" +
  "          // Store pending details to be updated later when chat_id is available" +
  "          this.pendingUserDetails = normalizedDetails;" +
  "" +
  "          const success = await this.submitUserDetails(normalizedDetails);" +
  "          if (success) {" +
  '            console.log("User details:", normalizedDetails);' +
  '            form.closest(".setup-container").remove();' +
  "            this.initialized = true;" +
  "            this.enableInput();" +
  "          }" +
  "        });" +
  "      }" +
  "    }" +
  "    async updateUserDetails(chatId, details) {" +
  "      try {" +
  "        const response = await fetch(" +
  "          `${this.apiEndpoint}chat/${chatId}/user-detail`," +
  "          {" +
  '            method: "PUT",' +
  "            headers: {" +
  '              "Content-Type": "application/json",' +
  '              "x-api-key": this.secret_key,' +
  "            }," +
  "            body: JSON.stringify(details)," +
  "          }" +
  "        );" +
  "" +
  "        if (!response.ok) {" +
  '          console.error("Failed to update user details");' +
  "        }" +
  "      } catch (error) {" +
  '        console.error("Error updating user details:", error);' +
  "      }" +
  "    }" +
  "" +
  "    async validateApiKey(apiKey) {" +
  "      // For demo purposes, always return true" +
  "      // In production, make an actual API request to validate" +
  "      return true;" +
  "    }" +
  "" +
  "    async initialize(secret_key) {" +
  "      try {" +
  "        const isValid = await this.validateApiKey(secret_key);" +
  "        if (!isValid) {" +
  '          this.showError("Invalid API key. Please check and try again.");' +
  "          return false;" +
  "        }" +
  "" +
  "        this.secret_key = secret_key;" +
  "        if (!this.userDetails) {" +
  "          this.showUserForm();" +
  "          return true;" +
  "        }" +
  "" +
  "        this.initialized = true;" +
  "        this.enableInput();" +
  "        // this.addMessage('Hello! How can I help you today?', false);" +
  "        const response = await fetch(" +
  "          `${this.apiEndpoint}agent/${this.agent_id}`," +
  "          {" +
  '            method: "GET",' +
  "            headers: {" +
  '              "Content-Type": "application/json",' +
  "            }," +
  "          }" +
  "        );" +
  "" +
  "        if (response.ok) {" +
  "          const apiRes = await response.json();" +
  "          const firstMessage = apiRes.data.chat_first_message;" +
  "          this.agent_photo = apiRes.data.image;" +
  "          this.addMessage(firstMessage, false);" +
  "        } else {" +
  '          console.error("Failed to fetch first message");' +
  "        }" +
  "        return true;" +
  "      } catch (error) {" +
  "        this.addMessage(error?.request?.body?.message, false);" +
  "        return false;" +
  "      }" +
  "    }" +
  "" +
  "    enableInput() {" +
  '      const userInput = document.getElementById("userInput");' +
  '      const sendButton = document.getElementById("sendButton");' +
  "      if (userInput && sendButton) {" +
  "        userInput.disabled = false;" +
  "        sendButton.disabled = false;" +
  "      }" +
  "    }" +
  "" +
  "    disableInput() {" +
  '      const userInput = document.getElementById("userInput");' +
  '      const sendButton = document.getElementById("sendButton");' +
  "      if (userInput && sendButton) {" +
  "        userInput.disabled = true;" +
  "        sendButton.disabled = true;" +
  "      }" +
  "    }" +
  "" +
  "    showError(message) {" +
  '      const existingError = document.querySelector(".error-message");' +
  "      if (existingError) {" +
  "        existingError.remove();" +
  "      }" +
  "" +
  '      const errorDiv = document.createElement("div");' +
  '      errorDiv.className = "error-message";' +
  "      errorDiv.textContent = message;" +
  '      document.getElementById("chatMessages")?.appendChild(errorDiv);' +
  "      setTimeout(() => errorDiv.remove(), 5000);" +
  "    }" +
  "    addMessage(message, isUser, chat_id = null) {" +
  '      const messageContainer = document.createElement("div");' +
  '      messageContainer.style.display = "flex";' +
  '      messageContainer.style.alignItems = "flex-start";' +
  '      messageContainer.style.marginBottom = "16px";' +
  "" +
  "      if (!isUser) {" +
  '        const botImage = document.createElement("img");' +
  "        botImage.src = `https://demoserver3.sgp1.digitaloceanspaces.com/uploads/images/original/${this.agent_photo}`;" +
  '        botImage.alt = "Bot";' +
  '        botImage.style.width = "26px";' +
  '        botImage.style.objectFit = "cover";' +
  '        botImage.style.height = "26px";' +
  '        botImage.style.borderRadius = "50%";' +
  '        botImage.style.marginRight = "8px";' +
  "        messageContainer.appendChild(botImage);" +
  "      }" +
  "" +
  '      const messageDiv = document.createElement("div");' +
  "      messageDiv.className = `message ${" +
  '        isUser ? "user-message" : "bot-message"' +
  "      }`;" +
  "" +
  '      const messageText = document.createElement("div");' +
  "      messageText.textContent = message;" +
  "      messageDiv.appendChild(messageText);" +
  "" +
  "      // Add timestamp" +
  '      const timestamp = document.createElement("div");' +
  "      if (isUser) {" +
  '        timestamp.className = "user-message-timestamp";' +
  "      } else {" +
  '        timestamp.className = "message-timestamp";' +
  "      }" +
  "      const time = new Date().toLocaleTimeString([], {" +
  '        hour: "2-digit",' +
  '        minute: "2-digit",' +
  "        hour12: true," +
  "      });" +
  "      timestamp.textContent = time;" +
  "      messageDiv.appendChild(timestamp);" +
  "" +
  "      messageContainer.appendChild(messageDiv);" +
  "" +
  "      if (isUser) {" +
  '        const userImage = document.createElement("img");' +
  "        userImage.src =" +
  '          "https://img.freepik.com/premium-vector/vector-flat-illustration-round-gray-man-icon-avatar-user-profile-person-icon-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9_719432-1794.jpg?w=740";' +
  '        userImage.alt = "User";' +
  '        userImage.style.width = "35px";' +
  '        userImage.style.objectFit = "cover";' +
  '        userImage.style.height = "35px";' +
  '        userImage.style.borderRadius = "50%";' +
  '        userImage.style.marginLeft = "8px";' +
  '        userImage.style.marginTop = "-5px";' +
  "        messageContainer.appendChild(userImage);" +
  "      }" +
  "" +
  "      console.log(message);" +
  "" +
  '      const typingIndicator = document.getElementById("typingIndicator");' +
  '      const chatMessages = document.getElementById("chatMessages");' +
  '      console.log(chatMessages, "chatMessages");' +
  "      if (typingIndicator && chatMessages) {" +
  "        chatMessages.insertBefore(messageContainer, typingIndicator);" +
  "      }" +
  "" +
  "      if (chat_id) {" +
  "        this.chatId = chat_id;" +
  "      }" +
  "" +
  "      this.messageHistory.push({" +
  "        isUser," +
  "        message," +
  "        timestamp: time," +
  "      });" +
  "" +
  "      this.scrollToBottom();" +
  "" +
  "      // Reset inactivity timer" +
  "      this.resetInactivityTimer();" +
  "" +
  "      // Check for conversation end triggers" +
  "      if (isUser && this.shouldEndConversation(message)) {" +
  "        this.showConversationEndPrompt();" +
  "      }" +
  "    }" +
  "" +
  "    shouldEndConversation(message) {" +
  '      const endTriggers = ["thank you", "thanks", "thankyou", "thank u", "thx"];' +
  "      return endTriggers.some((trigger) =>" +
  "        message.toLowerCase().includes(trigger)" +
  "      );" +
  "    }" +
  "" +
  "    showConversationEndPrompt() {" +
  '      const promptId = "conversation-end-prompt-" + Date.now();' +
  '      const promptDiv = document.createElement("div");' +
  "      promptDiv.id = promptId;" +
  '      promptDiv.className = "conversation-end";' +
  "      promptDiv.innerHTML = `" +
  '                <div class="feedbackmsg">Would you like to continue?</div>' +
  '                <div class="conversation-end-buttons">' +
  '                    <button class="conversation-end-button primary" data-action="continue">Continue Chat</button>' +
  '                    <button class="conversation-end-button" data-action="end">End Chat</button>' +
  "                </div>" +
  "            `;" +
  "" +
  '      const chatMessages = document.getElementById("chatMessages");' +
  "      chatMessages?.appendChild(promptDiv);" +
  "      this.scrollToBottom();" +
  "" +
  "      // Set timeout for auto-end after 1 minute" +
  "      this.conversationEndTimeout = setTimeout(() => {" +
  "        this.endConversation();" +
  "      }, 60000);" +
  "" +
  "      // Add event listeners" +
  '      promptDiv.querySelectorAll("button").forEach((button) => {' +
  '        button.addEventListener("click", (e) => {' +
  "          const action = e.target.dataset.action;" +
  '          if (action === "continue") {' +
  "            // Replace prompt with continuation message" +
  '            const continuationMessage = document.createElement("div");' +
  "            // continuationMessage.className = 'message bot-message';" +
  "            // continuationMessage.style.textAlign = 'center';" +
  "            // continuationMessage.innerHTML = 'Great! How else can I help you today?';" +
  "" +
  "            // Replace the prompt with the continuation message" +
  "            promptDiv.replaceWith(continuationMessage);" +
  "" +
  "            clearTimeout(this.conversationEndTimeout);" +
  "            this.lastActivityTime = Date.now();" +
  "          } else {" +
  "            this.endConversation();" +
  "          }" +
  "        });" +
  "      });" +
  "    }" +
  "" +
  "    async endConversation() {" +
  "      if (this.isChatEnding) return;" +
  "      this.isChatEnding = true;" +
  "" +
  "      try {" +
  "        if (this.chatId) {" +
  "          await fetch(`${this.apiEndpoint}/${this.chatId}`, {" +
  '            method: "PUT",' +
  "            headers: {" +
  '              "Content-Type": "application/json",' +
  '              "x-api-key": this.secret_key,' +
  "            }," +
  "          });" +
  "        }" +
  "" +
  "        this.messageHistory = [];" +
  "        this.chatId = null;" +
  "        this.initialized = false; // Reset initialization status" +
  "        this.isChatEnding = false;" +
  "" +
  '        const chatMessages = document.getElementById("chatMessages");' +
  "        if (chatMessages) {" +
  "          // Show user form again" +
  "          this.showUserForm();" +
  "        }" +
  "      } catch (error) {" +
  '        console.error("Error ending conversation:", error);' +
  "      }" +
  "    }" +
  "" +
  "    continueChatting() {" +
  "      this.isAwaitingFeedback = false;" +
  "      if (this.feedbackTimer) {" +
  "        clearTimeout(this.feedbackTimer);" +
  "      }" +
  "      // Remove the feedback prompt" +
  "      const feedbackMessage = document.querySelector(" +
  '        ".bot-message:last-of-type"' +
  "      );" +
  "      if (" +
  "        feedbackMessage &&" +
  '        feedbackMessage.innerHTML.includes("Would you like to continue?")' +
  "      ) {" +
  "        feedbackMessage.remove();" +
  "      }" +
  "      this.resetInactivityTimer();" +
  "    }" +
  "" +
  "    resetInactivityTimer() {" +
  "      if (this.inactivityTimer) {" +
  "        clearTimeout(this.inactivityTimer);" +
  "      }" +
  "      if (this.isAwaitingFeedback) return;" +
  "" +
  "      this.inactivityTimer = setTimeout(() => {" +
  "        if (!this.isAwaitingFeedback) {" +
  "          this.showConversationEndPrompt();" +
  "        }" +
  "      }, 120000);" +
  "    }" +
  "" +
  "    scrollToBottom() {" +
  '      const chatMessages = document.getElementById("chatMessages");' +
  "      if (chatMessages) {" +
  "        chatMessages.scrollTop = chatMessages.scrollHeight;" +
  "      }" +
  "    }" +
  "" +
  "    showTypingIndicator() {" +
  '      const typingIndicator = document.getElementById("typingIndicator");' +
  "      if (typingIndicator) {" +
  '        typingIndicator.style.display = "block";' +
  "        this.scrollToBottom();" +
  "      }" +
  "    }" +
  "" +
  "    hideTypingIndicator() {" +
  '      const typingIndicator = document.getElementById("typingIndicator");' +
  "      if (typingIndicator) {" +
  '        typingIndicator.style.display = "none";' +
  "      }" +
  "    }" +
  "" +
  "    async sendMessage(message) {" +
  "      if (!this.initialized || !this.secret_key || !this.agent_id) {" +
  '        this.showError("Please configure the chatbot first.");' +
  "        return;" +
  "      }" +
  "" +
  "      this.addMessage(message, true);" +
  "      this.showTypingIndicator();" +
  "" +
  "      try {" +
  "        const requestBody = {" +
  "          text: message," +
  "          secret_key: this.secret_key," +
  "          agent_id: this.agent_id," +
  "          ...(this.chatId && { chat_id: this.chatId })," +
  "        };" +
  "" +
  "        const response = await fetch(`${this.apiEndpoint}chat`, {" +
  '          method: "POST",' +
  "          headers: {" +
  '            "Content-Type": "application/json",' +
  '            "anthropic-version": "2023-06-01",' +
  "          }," +
  "          body: JSON.stringify(requestBody)," +
  "        });" +
  "" +
  "        if (!response.ok) {" +
  "          const errorData = await response.json(); // Parse the response body" +
  '          throw new Error(errorData?.message || "Unknown error occurred"); // Access the message key inside the JSON' +
  "        }" +
  "" +
  "        const data = await response.json();" +
  "" +
  "        // If we have pending user details and a new chat_id, update user details" +
  "        if (this.pendingUserDetails && data?.data?.chat_id) {" +
  "          await this.updateUserDetails(" +
  "            data.data.chat_id," +
  "            this.pendingUserDetails" +
  "          );" +
  "          this.pendingUserDetails = null;" +
  "        }" +
  "" +
  "        setTimeout(() => {" +
  "          this.hideTypingIndicator();" +
  "          this.addMessage(data?.data?.ai_response, false, data?.data?.chat_id);" +
  "        }, 500);" +
  "      } catch (error) {" +
  "        this.hideTypingIndicator();" +
  "        this.showError(error?.message);" +
  '        console.error("Error sending message:", error);' +
  "      }" +
  "    }" +
  "    showSetup() {" +
  '      const existingSetup = document.querySelector(".setup-container");' +
  "      if (existingSetup) return;" +
  "" +
  "      this.chatId = null;" +
  "      const setupHtml = `" +
  '                <div class="setup-container">' +
  '                    <h3 class="setup-title">Configure Chatbot</h3>' +
  "                    <input " +
  '                        type="password" ' +
  '                        class="setup-input" ' +
  '                        id="secret_key" ' +
  '                        placeholder="Enter your API Key" ' +
  '                        value="${this.secret_key || ""}"' +
  "                    />" +
  '                    <button class="setup-button" id="setupButton">Start Chat</button>' +
  "                </div>" +
  "            `;" +
  '      const chatMessages = document.getElementById("chatMessages");' +
  "      if (chatMessages) {" +
  "        chatMessages.innerHTML = setupHtml + chatMessages.innerHTML;" +
  "      }" +
  "    }" +
  "  }" +
  "" +
  "  // Initialize chatbot" +
  "  const chatbot = new ChatBot();" +
  "" +
  "  // If API key exists in localStorage, initialize immediately" +
  "  if (chatbot.secret_key) {" +
  "    chatbot.initialize(chatbot.secret_key);" +
  "  } else {" +
  "    chatbot.showSetup();" +
  "  }" +
  "" +
  "  // Event Listeners" +
  "  document" +
  '    .querySelector(".chat-trigger")' +
  '    ?.addEventListener("click", function () {' +
  '      const chatContainer = document.getElementById("chatContainer");' +
  "      if (!chatContainer) return;" +
  "" +
  "      const isHidden =" +
  '        chatContainer.style.display === "none" ||' +
  '        chatContainer.style.display === "";' +
  '      chatContainer.style.display = isHidden ? "flex" : "none";' +
  '      const secretKey = localStorage.getItem("secret_key");' +
  '      const agentId = localStorage.getItem("ai_agent");' +
  "      if (isHidden) {" +
  "        chatbot.initialize(secretKey);" +
  "      }" +
  "    });" +
  "" +
  '  document.querySelector(".close-btn")?.addEventListener("click", function () {' +
  '    const chatContainer = document.getElementById("chatContainer");' +
  "    if (chatContainer) {" +
  '      chatContainer.style.display = "none";' +
  "    }" +
  "  });" +
  "" +
  "  document" +
  '    .getElementById("userInput")' +
  '    ?.addEventListener("keypress", function (event) {' +
  '      if (event.key === "Enter") {' +
  "        sendMessage();" +
  "      }" +
  "    });" +
  "" +
  '  document.getElementById("sendButton")?.addEventListener("click", sendMessage);' +
  "" +
  "  // Helper functions" +
  "  async function setupChatbot() {" +
  '    const apiKeyInput = document.getElementById("secret_key");' +
  "    const apiKey = apiKeyInput?.value.trim();" +
  "" +
  "    if (!apiKey) {" +
  '      chatbot.showError("Please provide your API key.");' +
  "      return;" +
  "    }" +
  "" +
  "    const success = await chatbot.initialize(apiKey);" +
  "    if (success) {" +
  '      const setupContainer = document.querySelector(".setup-container");' +
  "      if (setupContainer) {" +
  "        setupContainer.remove();" +
  "      }" +
  "    }" +
  "  }" +
  "" +
  "  async function sendMessage() {" +
  '    const userInput = document.getElementById("userInput");' +
  "    if (!userInput) return;" +
  "" +
  "    const message = userInput.value.trim();" +
  "    if (!message) return;" +
  "" +
  '    userInput.value = "";' +
  "    await chatbot.sendMessage(message);" +
  "  }" +
  "" +
  "  // Setup button event listener" +
  '  document.addEventListener("click", function (event) {' +
  '    if (event.target && event.target.id === "setupButton") {' +
  "      setupChatbot();" +
  "    }" +
  "  });" +
  "})();" +
  "";
