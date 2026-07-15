/**
 * Project HOPE - AI Chat Room Core Engine
 * Architecture: Vanilla JS State Controller with Persistent Storage Pipelines
 */

document.addEventListener('DOMContentLoaded', () => {
  initPremiumChatEngine();
});

function initPremiumChatEngine() {
  // --- DOM Element Anchors ---
  const chatForm = document.getElementById('chat-composer-element');
  const chatInput = document.getElementById('composer-textarea');
  const chatViewport = document.getElementById('chat-stream-viewport');
  const typingIndicatorNode = document.getElementById('chat-typing-node');
  const promptChips = document.querySelectorAll('.prompt-chip');
  const submitBtn = document.getElementById('submit-send-btn');

  // --- Constants & Storage Configurations ---
  const STORAGE_KEY = 'project_hope_chat_history';
  const DEFAULT_AI_RESPONSE = "Thank you for sharing. I'm here to listen. 🌿";

  // Context-aware fallback mapping matrix matching user intents
  const contextResponses = {
    anxious: "I'm right here with you, Suyash. Let's anchor your awareness. Drop your shoulders away from your ears and let your hands rest loosely. We can count backwards together or explore a structural 4-4 grounding cadence. What sounds softest to your mind right now?",
    lonely: "Thank you for showing up here and trusting me with that feeling. Loneliness can make spaces feel heavy, but please know you are safely held in this environment. Let's sit together in this quiet harbor for a moment. What is a piece of music or a place that makes you feel most at peace?",
    sleep: "Let's turn down the volume of the day's events. You don't need to resolve anything right now. Close your eyes halfway, let your breathing become deep and slow, and imagine leaving your thoughts outside the room. Shall I count down with you to help soften your focus?",
    exams: "Exam stress is incredibly real, but remember that this test measures a moment in time, not your boundless capability or value. Let's split this overwhelm into small components. First, let's take a deep breath to flush the cortisol. Ready to map out a single small step?",
    motivation: "Let's uncover that inner resilience! You don't need to transform your entire world today—just focus on winning this next hour. Look back at the obstacles you've already traversed. You are entirely equipped to manage this. What small win can we target together?",
    talk: "I am listening closely. No judgment, no metrics, no expectations. This space belongs to you completely. Feel free to unload whatever is taking up room in your heart. I'm right here whenever you're ready."
  };

  if (!chatForm || !chatInput || !chatViewport) return;

  // --- Initialize Pipeline ---
  loadPersistedChatHistory();

  // --- Event Handling Streams ---

  // 1. Textarea Auto-Expansion Layout Pipeline
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 140) + 'px';
  });

  // 2. Keyboard Intercept: Press Enter to Transmit (Shift+Enter passes a line break)
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.requestSubmit();
    }
  });

  // 3. Suggested Prompt Chips Interaction Layer
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const promptValue = chip.getAttribute('data-prompt');
      if (promptValue) {
        // Automatically fills input field box as requested
        chatInput.value = promptValue;
        chatInput.dispatchEvent(new Event('input'));
        chatInput.focus();
      }
    });
  });

  // 4. Form Submission and Input Processing Pipeline
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cleanPrompt = chatInput.value.trim();
    
    // Guardrail: Avoid executing transmission loops on empty vectors
    if (!cleanPrompt) return;

    // Reset components post capture
    chatInput.value = '';
    chatInput.style.height = 'auto';

    executeMessageTransmission(cleanPrompt);
  });

  // --- Core Functional Engines ---

  /**
   * Orchestrates full pipeline state transition mapping during communication loops
   * @param {string} userMessageText 
   */
  async function executeMessageTransmission(userMessageText) {

    createChatBubbleElement(userMessageText, 'user');
    persistMessageToLocalStorage(userMessageText, 'user');
    scrollViewportToBaseline();

    toggleInterfaceControls(true);

    if (typingIndicatorNode) {
        chatViewport.appendChild(typingIndicatorNode);
        typingIndicatorNode.classList.remove('hidden');
        scrollViewportToBaseline();
    }

    try {

        const response = await fetch("http://localhost:3000/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: userMessageText
            })

        });

        const data = await response.json();

        if (typingIndicatorNode)
            typingIndicatorNode.classList.add('hidden');

        createChatBubbleElement(data.reply, "ai");

        persistMessageToLocalStorage(data.reply, "ai");

    }

    catch (error) {

        console.error(error);

        if (typingIndicatorNode)
            typingIndicatorNode.classList.add('hidden');

        createChatBubbleElement(
            "Sorry, I couldn't connect to HOPE AI right now.",
            "ai"
        );

    }

    toggleInterfaceControls(false);

    chatInput.focus();

    scrollViewportToBaseline();

}

  function createChatBubbleElement(textString, actorRole, timestampText = 'Just now') {
    const rowNode = document.createElement('div');
    rowNode.classList.add('chat-message-row', actorRole === 'user' ? 'user-row' : 'ai-row');

    const avatarNode = document.createElement('div');
    avatarNode.classList.add('message-actor-avatar', actorRole === 'user' ? 'user-avatar' : 'ai-avatar');
    avatarNode.setAttribute('role', 'img');
    avatarNode.setAttribute('aria-label', actorRole === 'user' ? 'Suyash Avatar' : 'HOPE AI Core Engine');
    avatarNode.textContent = actorRole === 'user' ? 'SU' : '✨';

    const wrapperNode = document.createElement('div');
    wrapperNode.classList.add('message-bubble-wrapper');

    const labelNode = document.createElement('div');
    labelNode.classList.add('actor-identity-label');
    labelNode.textContent = actorRole === 'user' ? 'Suyash' : 'HOPE AI';

    const bubbleContentNode = document.createElement('div');
    bubbleContentNode.classList.add('message-bubble-content');
    bubbleContentNode.textContent = textString;

    const timeNode = document.createElement('span');
    timeNode.classList.add('message-time-stamp');
    timeNode.textContent = timestampText;

    wrapperNode.appendChild(labelNode);
    wrapperNode.appendChild(bubbleContentNode);
    wrapperNode.appendChild(timeNode);

    rowNode.appendChild(avatarNode);
    rowNode.appendChild(wrapperNode);

    // Injects element safely ahead of typing markers inside target log channels
    if (typingIndicatorNode && typingIndicatorNode.parentNode === chatViewport) {
      chatViewport.insertBefore(rowNode, typingIndicatorNode);
    } else {
      chatViewport.appendChild(rowNode);
    }
  }

  /**
   * Toggles core controls to prevent race condition tracking vectors
   * @param {boolean} shouldDisable 
   */
  function toggleInterfaceControls(shouldDisable) {
    submitBtn.disabled = shouldDisable;
    chatInput.disabled = shouldDisable;
    
    if (shouldDisable) {
      submitBtn.setAttribute('aria-disabled', 'true');
      submitBtn.style.opacity = '0.6';
      submitBtn.style.cursor = 'not-allowed';
    } else {
      submitBtn.removeAttribute('aria-disabled');
      submitBtn.style.opacity = '';
      submitBtn.style.cursor = '';
    }
  }

  /**
   * Snaps layout containers to target scrolling baselines automatically
   */
  function scrollViewportToBaseline() {
    chatViewport.scrollTop = chatViewport.scrollHeight;
  }

  // --- Storage Serialization Managers ---

  /**
   * Serializes current messaging logs inside systemic client structures
   * @param {string} text 
   * @param {'user' | 'ai'} role 
   */
  function persistMessageToLocalStorage(text, role) {
    let history = [];
    try {
      const existingHistory = localStorage.getItem(STORAGE_KEY);
      history = existingHistory ? JSON.parse(existingHistory) : [];
    } catch (e) {
      console.error("Failed to parse LocalStorage history payload structure:", e);
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    history.push({ text, role, timestamp });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }

  /**
   * Pulls and draws long-tail data profiles across application lifecycle updates
   */
  function loadPersistedChatHistory() {
    try {
      const preservedRawData = localStorage.getItem(STORAGE_KEY);
      if (!preservedRawData) return;

      const structuralLogs = JSON.parse(preservedRawData);
      if (Array.isArray(structuralLogs)) {
        structuralLogs.forEach(logItem => {
          createChatBubbleElement(logItem.text, logItem.role, logItem.timestamp);
        });
        scrollViewportToBaseline();
      }
    } catch (error) {
      console.warn("Unable to deserialize persistent workspace history tracking objects:", error);
    }
  }
}