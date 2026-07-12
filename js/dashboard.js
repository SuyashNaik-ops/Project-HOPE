document.addEventListener('DOMContentLoaded', () => {
  initGreeting();
  initMoodSelector();
  initDailyQuotes();
  initJournalAutosave();
  initBreathingExercise();
});

/**
 * 1. Greeting Engine Based on System Time
 */
function initGreeting() {
  const greetingElement = document.getElementById('time-greeting');
  if (!greetingElement) return;

  const currentHour = new Date().getHours();
  let greetingText = 'Good Morning';

  if (currentHour >= 12 && currentHour < 17) {
    greetingText = 'Good Afternoon';
  } else if (currentHour >= 17 || currentHour < 4) {
    greetingText = 'Good Evening';
  }

  greetingElement.textContent = greetingText;
}

/**
 * 2. Mood Selection Framework
 */
function initMoodSelector() {
  const moodButtons = document.querySelectorAll('.mood-btn');
  const statusToast = document.getElementById('mood-status');

  moodButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle states via ARIA standard definitions
      moodButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.setAttribute('aria-checked', 'false');
      });

      button.classList.add('selected');
      button.setAttribute('aria-checked', 'true');

      // Toast feedback system
      if (statusToast) {
        statusToast.textContent = 'Mood saved successfully!';
        statusToast.classList.add('show');
        
        setTimeout(() => {
          statusToast.classList.remove('show');
        }, 3000);
      }
    });
  });
}

/**
 * 3. Daily Quote Generator Engine
 */
function initDailyQuotes() {
  const textElement = document.getElementById('daily-quote-text');
  const authorElement = document.getElementById('daily-quote-author');
  
  const quotesCollection = [
    { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
    { text: "Quiet the mind and the soul will speak.", author: "Ma Jaya Sati Bhagavati" },
    { text: "Give yourself permission to allow this moment to be exactly as it is.", author: "Jon Kabat-Zinn" },
    { text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.", author: "Thich Nhat Hanh" },
    { text: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein" },
    { text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.", author: "Hermann Hesse" },
    { text: "Amor Fati — Love your fate, which is in fact your life.", author: "Friedrich Nietzsche" },
    { text: "The component of deep peace is accepting what is right now without reservation.", author: "Headspace Wisdom" },
    { text: "You are stronger than you know, braver than you think, and more loved than you can imagine.", author: "A.A. Milne" },
    { text: "Step outside for a moment. Catch your breath. You are doing completely fine.", author: "Project HOPE" }
  ];

  const randomIndex = Math.floor(Math.random() * quotesCollection.length);
  const selectedQuote = quotesCollection[randomIndex];

  if (textElement && authorElement) {
    textElement.textContent = `"${selectedQuote.text}"`;
    authorElement.textContent = `— ${selectedQuote.author}`;
  }
}

/**
 * 4. LocalStorage Journal Engine
 */
function initJournalAutosave() {
  const textarea = document.getElementById('journal-textarea');
  const statusLabel = document.getElementById('journal-saved-status');
  const STORAGE_KEY = 'project_hope_journal_autosave';

  if (!textarea) return;

  // Initial Content Load
  const persistedData = localStorage.getItem(STORAGE_KEY);
  if (persistedData) {
    textarea.value = persistedData;
    if (statusLabel) statusLabel.textContent = 'Last saved from previous session';
  }

  // Debounced Autosave Stream Strategy
  let debounceTimeout;
  textarea.addEventListener('input', () => {
    if (statusLabel) statusLabel.textContent = 'Typing...';
    
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, textarea.value);
      if (statusLabel) {
        statusLabel.textContent = 'Last saved just now';
      }
    }, 1000); // Saves exactly 1 second after typing pauses
  });
}

/**
 * 5. Animated Mindful Breathing Component Controller
 */
function initBreathingExercise() {
  const actionButton = document.getElementById('start-breathing-btn');
  const breathingCircle = document.getElementById('breathing-circle');
  const instructionText = document.getElementById('breathing-text');
  
  if (!actionButton || !breathingCircle || !instructionText) return;

  let isExerciseActive = false;
  let breathingIntervalCycle;

  actionButton.addEventListener('click', () => {
    if (!isExerciseActive) {
      // Start Session Action
      isExerciseActive = true;
      actionButton.textContent = 'Stop Exercise';
      actionButton.classList.add('active');
      executeBreathingPhase();
    } else {
      // Terminate Session Action
      isExerciseActive = false;
      clearInterval(breathingIntervalCycle);
      breathingCircle.className = 'breathing-circle-inner'; // Reset modifiers
      instructionText.textContent = 'Session paused. Ready when you are.';
      actionButton.textContent = 'Start Breathing';
    }
  });

  function executeBreathingPhase() {
    let phase = 0; // 0 = Inhale, 1 = Hold, 2 = Exhale, 3 = Hold

    const runPhase = () => {
      if (!isExerciseActive) return;
      
      switch (phase) {
        case 0:
          instructionText.textContent = 'Breathe in slowly...';
          breathingCircle.className = 'breathing-circle-inner inhale';
          phase = 1;
          setTimeout(runPhase, 4000); // 4s Inhale
          break;
        case 1:
          instructionText.textContent = 'Hold and rest here...';
          phase = 2;
          setTimeout(runPhase, 4000); // 4s Hold
          break;
        case 2:
          instructionText.textContent = 'Exhale gently and let go...';
          breathingCircle.className = 'breathing-circle-inner exhale';
          phase = 3;
          setTimeout(runPhase, 4000); // 4s Exhale
          break;
        case 3:
          instructionText.textContent = 'Hold and remain empty...';
          phase = 0;
          setTimeout(runPhase, 4000); // 4s Hold
          break;
      }
    };

    runPhase();
  }
}