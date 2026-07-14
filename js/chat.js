document.addEventListener('DOMContentLoaded', () => {
  initPremiumChatEngine();
});

function initPremiumChatEngine() {
  const chatForm = document.getElementById('chat-composer-element');
  const chatInput = document.getElementById('composer-textarea');
  const chatViewport = document.getElementById('chat-stream-viewport');
  const typingIndicatorNode = document.getElementById('chat-typing-node');
  const promptChips = document.querySelectorAll('.prompt-chip');

  // Multi-tier structural warm responses matching contextual intents
  const analyticalResponses = {
    anxious: "I'm right here with you, Suyash. Let's anchor your awareness. Drop your shoulders away from your ears and let your hands rest loosely. We can count backwards together or explore a structural 4-4 grounding cadence. What sounds softest to your mind right now?",
    lonely: "Thank you for showing up here and trusting me with that feeling. Loneliness can make spaces feel heavy, but please know you are safely held in this environment. Let's sit together in this quiet harbor for a moment. What is a piece of music or a place that makes you feel most at peace?",
    sleep: "Let's turn down the volume of the day's events. You don't need to resolve anything right now. Close your eyes halfway, let your breathing become deep and slow, and imagine leaving your thoughts outside the room. Shall I count down with you to help soften your focus?",
    exams: "Exam stress is incredibly real, but remember that this test measures a moment in time, not your boundless capability or value. Let's split this overwhelm into small components. First, let's take a deep breath to flush the cortisol. Ready to map out a single small step?",
    motivation: "Let's uncover that inner resilience! You don't need to transform your entire world today—just focus on winning this next hour. Look back at the obstacles you've already traversed. You are entirely equipped to manage this. What small win can we target together?",
    talk: "I am listening closely. No judgment, no metrics, no expectations. This space belongs to you completely. Feel free to unload whatever is taking up room in your heart. I'm right here whenever you're ready."
  };

  if (!chatForm || !chatInput || !chatViewport) return;

  // Elastic auto-expansion layout pipeline for the entry textarea
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 140) + 'px';
  });

  // Attach chip events to prompt inputs
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const promptValue = chip.getAttribute('data-prompt');
      if (promptValue) {
        executeMessageTransmission(promptValue);
      }
    });
  });

  // Form submit control interception pipeline
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cleanPrompt = chatInput.value.trim();
    if (cleanPrompt) {
      executeMessageTransmission(cleanPrompt);
      chatInput.value = '';
      chatInput.style.height = 'auto';
    }
  });

  function executeMessageTransmission(messageString) {
    // 1. Inject User Bubble Element to Viewport
    createChatBubbleElement(messageString, 'user');
    scrollViewportToBaseline();

    // 2. Surface High-Fidelity Streaming Indicator Node
    if (typingIndicatorNode) {
      chatViewport.appendChild(typingIndicatorNode);
      typingIndicatorNode.classList.remove('hidden');
      scrollViewportToBaseline();
    }

    // 3. Intelligently map response text based on contextual keywords
    let responseText = "I hear you deeply, Suyash. Let's explore that perspective further. Tell me a bit more about what you feel arising in this current moment.";
    const processedQuery = messageString.toLowerCase();

    if (processedQuery.includes('anxious') || processedQuery.includes('anxiety') || processedQuery.includes('grounding')) {
      responseText = analyticalResponses.anxious;
    } else if (processedQuery.includes('lonely') || processedQuery.includes('alone')) {
      responseText = analyticalResponses.lonely;
    } else if (processedQuery.includes('sleep') || processedQuery.includes('awake') || processedQuery.includes('night')) {
      responseText = analyticalResponses.sleep;
    } else if (processedQuery.includes('exam') || processedQuery.includes('test') || processedQuery.includes('study')) {
      responseText = analyticalResponses.exams;
    } else if (processedQuery.includes('motivation') || processedQuery.includes('inspire') || processedQuery.includes('push')) {
      responseText = analyticalResponses.motivation;
    } else if (processedQuery.includes('talk') || processedQuery.includes('listen') || processedQuery.includes('judgment')) {
      responseText = analyticalResponses.talk;
    }

    // 4. Delay pipeline execution to mimic high-performance semantic response windows
    setTimeout(() => {
      if (typingIndicatorNode) typingIndicatorNode.classList.add('hidden');
      createChatBubbleElement(responseText, 'ai');
      scrollViewportToBaseline();
    }, 1200 + Math.random() * 800);
  }

  function createChatBubbleElement(textString, actorRole) {
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
    timeNode.textContent = 'Just now';

    wrapperNode.appendChild(labelNode);
    wrapperNode.appendChild(bubbleContentNode);
    wrapperNode.appendChild(timeNode);

    rowNode.appendChild(avatarNode);
    rowNode.appendChild(wrapperNode);

    if (typingIndicatorNode) {
      chatViewport.insertBefore(rowNode, typingIndicatorNode);
    } else {
      chatViewport.appendChild(rowNode);
    }
  }

  function scrollViewportToBaseline() {
    chatViewport.scrollTop = chatViewport.scrollHeight;
  }
}