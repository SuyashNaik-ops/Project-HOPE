/**
 * Project HOPE - Standard Functional Script Matrix
 * Architectural Framework: Vanilla JS Data Pipeline Controllers
 */

const STORAGE_TIMELINE_KEY = 'hope_ai_mood_journey_records';
const CONFIG_KEY = 'hope_system_config_states';
const JOURNAL_STORAGE_KEY = 'hope_journal_entries';

let currentBreathingActive = false;
let recoveryBreathingActive = false;
let currentSelectedPattern = 'Box Breathing';
let activeAudioNode = null;
let currentActiveTrackKey = 'rain';

// Ambient Audio Track Source Parameters Pool
const ambientSoundTracksPool = {
  rain: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 
  ocean: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  forest: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  piano: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
};

document.addEventListener('DOMContentLoaded', function() {
  systemInitializeGreeting();
  systemInitializeConfigData();
  systemInitializeDateDisplay();
  quoteCycleNew();
  journalSyncCountLabels();
  renderTimelineTimeline('all');
});

/* --- Ambient Sound Engine Controllers --- */
function toggleAmbientMenuDrawer() {
  const drawer = document.getElementById('sound-menu-drawer');
  if (drawer) drawer.classList.toggle('drawer-open');
}

function selectAmbientTrack(trackKey) {
  currentActiveTrackKey = trackKey;
  document.querySelectorAll('.track-selection-chip').forEach(function(chip) {
    chip.classList.remove('active-track');
  });
  
  const targetChip = document.getElementById('track-' + trackKey);
  if (targetChip) {
    targetChip.classList.add('active-track');
  }

  if (activeAudioNode) {
    activeAudioNode.pause();
    activeAudioNode = null;
  }
  playAmbientAudio();
}

function playAmbientAudio() {
  if (!activeAudioNode) {
    activeAudioNode = new Audio(ambientSoundTracksPool[currentActiveTrackKey]);
    activeAudioNode.loop = true;
    activeAudioNode.volume = 0.12; 
  }
  activeAudioNode.play().catch(function(e) {
    console.log("User interaction gesture loop step validation pending.");
  });
  triggerSystemToast("Playing Track: " + currentActiveTrackKey.toUpperCase());
}

function pauseAmbientAudio() {
  if (activeAudioNode) {
    activeAudioNode.pause();
    triggerSystemToast("Ambient Audio Feed Paused");
  }
}

function toggleMuteAmbientAudio() {
  const btn = document.getElementById('btn-sound-mute');
  if (activeAudioNode) {
    activeAudioNode.muted = !activeAudioNode.muted;
    if (btn) btn.textContent = activeAudioNode.muted ? "🔇 Unmute" : "🔊 Mute";
    triggerSystemToast(activeAudioNode.muted ? "Sound Stream Muted" : "Sound Stream Unmuted");
  }
}

function systemInitializeDateDisplay() {
  const node = document.getElementById('hero-date-display');
  if (node) {
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    node.textContent = new Date().toLocaleDateString('en-US', opts);
  }
}

/* --- Workspace Views Interface Tab Router Engine --- */
function switchWorkspaceTab(viewKey) {
  document.querySelectorAll('.workspace-panel-node').forEach(function(p) {
    p.classList.remove('active-panel');
  });
  document.querySelectorAll('.nav-center .nav-item').forEach(function(t) {
    t.classList.remove('active');
  });

  const activeView = document.getElementById('panel-view-' + viewKey);
  const activeTab = document.getElementById('tab-' + viewKey);

  // Synchronize top link element visual structures on local routing clicks
  const topLinkActive = document.querySelector('.nav-center a[href="' + viewKey + '.html"]');
  if (topLinkActive) {
    document.querySelectorAll('.nav-center a').forEach(function(link) {
      link.classList.remove('active');
    });
    topLinkActive.classList.add('active');
  }

  if (activeView && activeTab) {
    activeView.classList.add('active-panel');
    activeTab.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // Graceful routing translation fallback validation array rules
    triggerSystemToast("Navigating to target profile module link location: " + viewKey.toUpperCase());
  }
}

function showSystemModal(title, textHTML) {
  const modal = document.getElementById('system-sandbox-modal');
  document.getElementById('modal-system-title').innerHTML = title;
  document.getElementById('modal-system-body').innerHTML = textHTML;
  modal.classList.add('modal-active-state');
  modal.setAttribute('aria-hidden', 'false');
}

function dismissSystemModal() {
  const modal = document.getElementById('system-sandbox-modal');
  modal.classList.remove('modal-active-state');
  modal.setAttribute('aria-hidden', 'true');
}

function triggerSystemToast(msg) {
  const toast = document.getElementById('toast-notification-center');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('toast-visible');
  setTimeout(function() { toast.classList.remove('toast-visible'); }, 2500);
}

function triggerNotificationToast() {
  triggerSystemToast("Telemetry check: Core workspace pipelines active and verified.");
}

function systemInitializeGreeting() {
  const node = document.getElementById('time-greeting');
  if (!node) return;
  const hour = new Date().getHours();
  let text = 'Good Morning';
  if (hour >= 12 && hour < 17) text = 'Good Afternoon';
  else if (hour >= 17 || hour < 4) text = 'Good Evening';
  node.textContent = text;
}

function launchAudioPipeline(url) {
  triggerSystemToast("Opening external validated media anchor stream...");
  window.open(url, '_blank', 'noopener,noreferrer');
}

/* --- FEATURE 1: DYNAMIC AI MOOD JOURNEY TIMELINE --- */
function getTimelineRecords() {
  try { const r = localStorage.getItem(STORAGE_TIMELINE_KEY); return r ? JSON.parse(r) : []; } catch(e) { return []; }
}

function pushTimelineRecord(moodLabel, contextualText, typeClassifier) {
  const logs = getTimelineRecords();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const currentDayStr = days[new Date().getDay()];
  
  logs.push({
    id: Date.now(),
    day: currentDayStr,
    mood: moodLabel,
    text: contextualText,
    classifier: typeClassifier,
    timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  });
  localStorage.setItem(STORAGE_TIMELINE_KEY, JSON.stringify(logs));
  renderTimelineTimeline('all');
}

function renderTimelineTimeline(filterCriteria) {
  const container = document.getElementById('journey-rendering-viewport');
  if (!container) return;
  container.innerHTML = '';
  
  const records = getTimelineRecords();
  if (records.length === 0) {
    container.innerHTML = '<p style="font-style:italic; color:#777; padding-left:40px;">No journey nodes tracked yet. Log a journal entry or complete a mood check to populate the map.</p>';
    return;
  }

  const targetedRecords = records.filter(function(r) {
    if (filterCriteria === 'happy') return r.classifier === 'happy';
    if (filterCriteria === 'difficult') return r.classifier === 'difficult';
    return true;
  });

  targetedRecords.forEach(function(r) {
    const item = document.createElement('div');
    item.className = 'timeline-node-card ' + (r.classifier === 'happy' ? 'timeline-card-happy' : 'timeline-card-difficult');
    
    item.innerHTML = '<div class="timeline-indicator-dot"></div>' +
      '<div style="flex:1;">' +
        '<div style="display:flex; justify-content:space-between; width:100%; align-items:center;">' +
          '<strong style="font-size:0.95rem;">' + r.day + ' ' + r.mood + '</strong>' +
          '<span style="font-size:0.75rem; color:#777;">' + r.timestamp + '</span>' +
        '</div>' +
        '<p style="font-size:0.88rem; margin-top:4px; opacity:0.95;">"' + r.text + '"</p>' +
        '<button onclick="deleteTimelineItem(' + r.id + ')" style="background:none; border:none; color:#FF2B2B; font-size:0.75rem; margin-top:8px; cursor:pointer; font-weight:600;">Delete Entry</button>' +
      '</div>';
      
    container.appendChild(item);
  });
}

function deleteTimelineItem(id) {
  let logs = getTimelineRecords();
  logs = logs.filter(function(r) { return r.id !== id; });
  localStorage.setItem(STORAGE_TIMELINE_KEY, JSON.stringify(logs));
  renderTimelineTimeline('all');
  triggerSystemToast("Selected node removed from journey matrix logs.");
}

function purgeTimelineLogs() {
  if (confirm("Confirm structural reset of emotional timeline logs?")) {
    localStorage.removeItem(STORAGE_TIMELINE_KEY);
    renderTimelineTimeline('all');
    triggerSystemToast("Ecosystem timeline cleared.");
  }
}

function registerMoodSelection(btnRef, moodString, emojiIcon) {
  document.querySelectorAll('.mood-btn').forEach(function(b) { b.classList.remove('selected'); });
  btnRef.classList.add('selected');
  localStorage.setItem('hope_active_mood_pulse', moodString);
  
  const toast = document.getElementById('mood-status');
  if (toast) {
    toast.textContent = "Saved mood: " + moodString;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 2500);
  }
  
  const classifier = ['Happy','Calm'].includes(moodString) ? 'happy' : 'difficult';
  pushTimelineRecord(emojiIcon, "Logged a direct state check-in with a target descriptor score of " + moodString + ".", classifier);
}

/* --- FEATURE 2: ONE CLICK RECOVERY SYSTEM FUNCTIONS --- */
const recoveryCalmMessages = [
  "Suyash, stop for just a second. You do not need to solve the rest of your life right this moment. Let the noise outside settle. You are breathing, you are protected, and you are here.",
  "Bring your focus completely inward. The current storm is a shifting set of chemical coordinates inside. We are going to regulate your nervous system right now."
];
const recoveryAffirmations = [
  "This intense wave is temporary. My capacity to safely hold this feeling is absolute.",
  "I am scaling back all expectations. I am allowed to just take this one simple second at a time."
];

function toggleRecoveryMode(activateState) {
  const panel = document.getElementById('recovery-mode-overlay');
  if (activateState) {
    panel.classList.add('recovery-active');
    document.getElementById('recovery-calm-msg').textContent = recoveryCalmMessages[Math.floor(Math.random() * recoveryCalmMessages.length)];
    document.getElementById('recovery-affirmation-text').textContent = recoveryAffirmations[Math.floor(Math.random() * recoveryAffirmations.length)];
    triggerSystemToast("One-Click Recovery Protocol initialized.");
  } else {
    stopRecoveryBreathing();
    panel.classList.remove('recovery-active');
  }
}

function startRecoveryBreathing() {
  recoveryBreathingActive = true;
  const circle = document.getElementById('recovery-breath-circle');
  const text = document.getElementById('recovery-breath-text');
  
  function runCycle() {
    if (!recoveryBreathingActive) return;
    text.textContent = "Breathe In (4s)";
    if (circle) circle.style.transform = "scale(1.8)";
    
    setTimeout(function() {
      if (!recoveryBreathingActive) return;
      text.textContent = "Hold Rest (7s)";
      setTimeout(function() {
        if (!recoveryBreathingActive) return;
        text.textContent = "Exhale Slow (8s)";
        if (circle) circle.style.transform = "scale(1)";
        setTimeout(function() {
          if (recoveryBreathingActive) runCycle();
        }, 8000);
      }, 7000);
    }, 4000);
  }
  runCycle();
}

/**
 * Capture navigation click interceptions dynamically across anchor link sets
 */
document.querySelectorAll('.top-nav a').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    const routeTarget = anchor.getAttribute('href');
    if (routeTarget && routeTarget.indexOf('html') !== -1) {
      const key = routeTarget.replace('.html', '');
      const matchedNode = document.getElementById('panel-view-' + key);
      if (matchedNode) {
        e.preventDefault();
        switchWorkspaceTab(key);
      }
    }
  });
});

function stopRecoveryBreathing() {
  recoveryBreathingActive = false;
  const circle = document.getElementById('recovery-breath-circle');
  if (circle) {
    circle.style.transform = "scale(1)";
  }
  document.getElementById('recovery-breath-text').textContent = "Exercise suspended.";
}

function submitRecoveryChat() {
  const input = document.getElementById('recovery-chat-input');
  const text = input.value.trim();
  if (!text) return;

  const log = document.getElementById('recovery-chat-log');
  const userP = document.createElement('p');
  userP.innerHTML = "👤 <strong>You:</strong> " + text;
  log.appendChild(userP);
  input.value = '';

  setTimeout(function() {
    const aiP = document.createElement('p');
    aiP.innerHTML = "✨ <strong>HOPE AI:</strong> I hear you. Focus exclusively on regular breathing loop steps right now. I am here.";
    log.appendChild(aiP);
    log.scrollTop = log.scrollHeight;
  }, 1000);
}

/* --- COMFORT KIT STRATEGIC DISPATCHER --- */
const comfortActionsPool = {
  breathing: { title: "🌬️ Core Breathing Calibration", text: "Engage the Mindful Breathing card module below. Choose your target cycle pattern (Box, 4-7-8, or Calm Mode) and trigger the execution pipeline sequence." },
  grounding: { title: "🧘 5-4-3-2-1 Somatic Grounding Method", text: "Isolate cognitive noise strings instantly. Identify 5 things you see clearly, 4 distinct textures you touch, 3 sound frequencies you hear, 2 scents you smell, and 1 taste marker." },
  affirmations: { title: "💡 Dynamic Cognitive Affirmation", text: "'I choose peace over performance criteria matrices. This immediate transition wave contains temporary parameters; my internal structure remains centered.'" },
  gratitude: { title: "✍️ Active Gratitude Mapping Vector", text: "Reflect intentionally right now. Note three micro entities or local support coordinates you appreciate right now to settle your focus." },
  stretch: { title: "🤸 Biological Realignment Stretch", text: "Release physical structural compression. Roll back both shoulders smoothly, extend your upper frame skyward, and exhale fully to reset heart metrics." },
  tips: { title: "🌿 Calm Living Parameter Advice", text: "Mitigate hyper-arousal symptoms smoothly. Reduce digital monitor exposure, drink a glass of fresh room-temperature water, and ground awareness inside the room." }
};

function executeComfortAction(actionKey) {
  const match = comfortActionsPool[actionKey];
  if (match) {
    showSystemModal(match.title, "<p style='line-height:1.55; font-size:0.95rem;'>" + match.text + "</p>");
    triggerSystemToast("Comfort action pipeline loaded successfully.");
  }
}

/* --- JOURNAL MODULE LOGIC CORES --- */
function getJournalEntries() {
  try { const r = localStorage.getItem(JOURNAL_STORAGE_KEY); return r ? JSON.parse(r) : []; } catch(e) { return []; }
}

function journalSyncCountLabels() {
  const count = getJournalEntries().length;
  const targetLabel = document.getElementById('journal-saved-status');
  if (targetLabel) targetLabel.textContent = "Logs synchronized (" + count + " records verified)";
}

function journalSaveDataEntry() {
  const mood = document.getElementById('j-mood').value;
  const energy = document.getElementById('j-energy').value;
  const stress = document.getElementById('j-stress').value;
  const sleep = document.getElementById('j-sleep').value;
  const happened = document.getElementById('j-happened').value.trim();
  const challenged = document.getElementById('j-challenged').value.trim();
  const smile = document.getElementById('j-smile').value.trim();
  const gratitude = document.getElementById('j-gratitude').value.trim();
  const goal = document.getElementById('j-goal').value.trim();

  if (!happened) {
    triggerSystemToast("Foundational descriptions cannot be null vectors.");
    return;
  }

  const entries = getJournalEntries();
  entries.push({ id: Date.now(), mood, energy, stress, sleep, happened, challenged, smile, gratitude, goal, timestamp: new Date().toLocaleString() });
  localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
  
  document.getElementById('j-happened').value = '';
  document.getElementById('j-challenged').value = '';
  document.getElementById('j-smile').value = '';
  document.getElementById('j-gratitude').value = '';
  document.getElementById('j-goal').value = '';

  journalSyncCountLabels();
  triggerSystemToast("Comprehensive matrix entry committed to storage structures successfully.");
  
  const isHappy = ['😊 Happy','😌 Calm'].includes(mood);
  pushTimelineRecord(mood.split(' ')[0], "Journal Log: " + happened.substring(0, 40) + "...", isHappy ? 'happy' : 'difficult');
}

function journalViewPreviousRecords() {
  const entries = getJournalEntries();
  if (entries.length === 0) { showSystemModal("Journal History", "No data instances serialized yet."); return; }
  
  let html = "<div style='display:flex; flex-direction:column; gap:16px;'>";
  entries.forEach(function(e, idx) {
    html += "<div style='background:rgba(0,0,0,0.02); padding:16px; border-radius:12px; font-size:0.88rem;'>" +
      "<div style='display:flex; justify-content:space-between; border-bottom:1px solid rgba(0,0,0,0.05); padding-bottom:6px;'>" +
        "<strong>Entry Record Archive #" + (idx + 1) + "</strong>" +
        "<span style='color:#666;'>" + e.timestamp + "</span>" +
      "</div>" +
      "<div style='margin-top:8px; display:grid; grid-template-columns:1fr 1fr; gap:8px; background:white; padding:10px; border-radius:8px;'>";
    html += "<span>Mood: <b>" + e.mood + "</b></span><span>Energy: <b>" + e.energy + "</b></span>" +
        "<span>Stress: <b>" + e.stress + "</b></span><span>Sleep: <b>" + e.sleep + "</b></span>" +
      "</div>" +
      "<p style='margin-top:8px;'><b>Happened:</b> \"" + e.happened + "\"</p>" +
      (e.challenged ? "<p><b>Challenges:</b> \"" + e.challenged + "\"</p>" : "") +
      (e.smile ? "<p><b>Smile Trigger:</b> \"" + e.smile + "\"</p>" : "") +
      (e.gratitude ? "<p><b>Gratitude Vectors:</b> " + e.gratitude + "</p>" : "") +
      (e.goal ? "<p><b>Objective Target:</b> " + e.goal + "</p>" : "") +
    "</div>";
  });
  html += "</div>";
  showSystemModal("Historical Evaluation Archives", html);
}

function journalToggleSearchSystem() {
  const panel = document.getElementById('journal-search-drawer');
  if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function executeJournalQueryFilter() {
  const q = document.getElementById('journal-query-input').value.toLowerCase();
  const out = document.getElementById('journal-query-results');
  out.innerHTML = '';
  if (!q) return;

  getJournalEntries().filter(function(e) {
    return e.happened.toLowerCase().includes(q) || e.challenged.toLowerCase().includes(q);
  }).forEach(function(e) {
    const div = document.createElement('div');
    div.style.cssText = "background:var(--hope-secondary); padding:10px; border-radius:6px; cursor:pointer; font-size:0.85rem;";
    div.textContent = "[" + e.timestamp + "] Match Vector: " + e.happened.substring(0, 40) + "...";
    div.onclick = function() {
      showSystemModal("View Archive Element (" + e.timestamp + ")", "<p style='white-space:pre-wrap;'>" + e.happened + "</p>");
    };
    out.appendChild(div);
  });
}

function journalPurgeLatestRecord() {
  const e = getJournalEntries();
  if (e.length === 0) return;
  if (confirm("Confirm deletion of the most recent evaluation block?")) {
    e.pop();
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(e));
    journalSyncCountLabels();
    triggerSystemToast("Target historical entry object unlinked.");
  }
}

function journalTriggerDataExport() {
  let dataStr = "PROJECT HOPE CORE JOURNAL DATA ARRAYS\n\n";
  getJournalEntries().forEach(function(e, i) {
    dataStr += "ENTRY #" + (i + 1) + " [" + e.timestamp + "]\nMood: " + e.mood + " | Energy: " + e.energy + " | Stress: " + e.stress + " | Sleep: " + e.sleep + "\nLog: " + e.happened + "\nChallenged: " + e.challenged + "\nSmile: " + e.smile + "\nGratitude: " + e.gratitude + "\nGoal: " + e.goal + "\n----------------\n\n";
  });
  const blob = new Blob([dataStr], {type:'text/plain'});
  const a = document.createElement('a');
  a.download = 'hope_mental_wellness_journal.txt';
  a.href = URL.createObjectURL(blob);
  a.click();
  triggerSystemToast("Structured document transmission initialized.");
}

/* --- Motivational Quotes Subsystem --- */
const coreQuotes = [
  { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
  { text: "Quiet the mind and the soul will speak.", author: "Ma Jaya Sati Bhagavati" },
  { text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.", author: "Thich Nhat Hanh" }
];
let activeQuote = null;
function quoteCycleNew() {
  activeQuote = coreQuotes[Math.floor(Math.random() * coreQuotes.length)];
  document.getElementById('daily-quote-text').textContent = '"' + activeQuote.text + '"';
  document.getElementById('daily-quote-author').textContent = '— ' + activeQuote.author;
  document.getElementById('quote-fav-btn').textContent = "Favorite";
}
function quoteCopyActive() {
  navigator.clipboard.writeText('"' + activeQuote.text + '" — ' + activeQuote.author).then(function() {
    triggerSystemToast("Quote text securely copied into client memory clipboards.");
  });
}
function quoteFavoriteActive() {
  document.getElementById('quote-fav-btn').textContent = "❤️ Favorited";
  triggerSystemToast("Quote successfully linked inside personalized favorites.");
}

/* --- Mindful Breathing Module --- */
function selectBreathingPattern(type) {
  currentSelectedPattern = type;
  document.querySelectorAll('#breathing-card-anchor .btn-secondary').forEach(function(b) {
    b.classList.remove('active-cadence-btn');
  });
  if (type == 'Box Breathing') document.getElementById('cadence-box').classList.add('active-cadence-btn');
  if (type == '4-7-8') document.getElementById('cadence-478').classList.add('active-cadence-btn');
  if (type == 'Calm Mode') document.getElementById('cadence-calm').classList.add('active-cadence-btn');
  triggerSystemToast("Somatic interval pattern updated: " + type);
}

function startCoreBreathing() {
  currentBreathingActive = true;
  const inner = document.getElementById('breathing-circle');
  const text = document.getElementById('breathing-text');
  if (!inner || !text) return;
  
  let inhaleDuration = currentSelectedPattern === 'Calm Mode' ? 5000 : 4000;
  let exhaleDuration = currentSelectedPattern === '4-7-8' ? 8000 : (currentSelectedPattern === 'Calm Mode' ? 5000 : 4000);
  let holdDuration = currentSelectedPattern === '4-7-8' ? 7000 : (currentSelectedPattern === 'Box Breathing' ? 4000 : 0);

  function loop() {
    if (!currentBreathingActive) return;
    text.textContent = "Inhale Slowly (" + (inhaleDuration / 1000) + "s)";
    inner.style.transform = "scale(1.8)";

    setTimeout(function() {
      if (!currentBreathingActive) return;
      if (holdDuration > 0) {
        text.textContent = "Hold Posture (" + (holdDuration / 1000) + "s)";
        setTimeout(function() {
          if (!currentBreathingActive) return;
          executeExhale();
        }, holdDuration);
      } else {
        executeExhale();
      }
    }, inhaleDuration);
  }

  function executeExhale() {
    text.textContent = "Exhale (" + (exhaleDuration / 1000) + "s)";
    inner.style.transform = "scale(1)";
    setTimeout(function() {
      if (currentBreathingActive) loop();
    }, exhaleDuration);
  }

  loop();
  triggerSystemToast("Core structural breathing exercise initialized.");
}

function pauseCoreBreathing() {
  currentBreathingActive = false;
  const inner = document.getElementById('breathing-circle');
  if (inner) {
    inner.style.transform = "scale(1)";
  }
  document.getElementById('breathing-text').textContent = "Exercise paused.";
}
function restartCoreBreathing() { pauseCoreBreathing(); setTimeout(startCoreBreathing, 250); }

/* --- Profile Module Drawer Elements --- */
function profileToggleEditView() {
  const drawer = document.getElementById('profile-edit-drawer');
  if (drawer.style.display === 'none') {
    drawer.style.display = 'flex';
    document.getElementById('profile-edit-trigger').textContent = "Cancel Changes";
    document.getElementById('profile-save-trigger').disabled = false;
    document.getElementById('profile-save-trigger').style.opacity = '1';
    document.getElementById('ipt-profile-name').value = document.getElementById('lbl-profile-name').textContent;
    document.getElementById('ipt-profile-email').value = document.getElementById('lbl-profile-email').textContent;
    document.getElementById('ipt-profile-college').value = document.getElementById('lbl-profile-college').textContent;
    document.getElementById('ipt-profile-course').value = document.getElementById('lbl-profile-course').textContent;
    document.getElementById('ipt-profile-about').value = document.getElementById('lbl-profile-about').textContent;
    document.getElementById('ipt-profile-goal').value = document.getElementById('lbl-profile-goal').textContent;
  } else {
    drawer.style.display = 'none';
    document.getElementById('profile-edit-trigger').textContent = "Edit Profile Fields";
    document.getElementById('profile-save-trigger').disabled = true;
    document.getElementById('profile-save-trigger').style.opacity = '0.5';
  }
}

function profileSaveDataPipeline() {
  document.getElementById('lbl-profile-name').textContent = document.getElementById('ipt-profile-name').value;
  document.getElementById('lbl-profile-email').textContent = document.getElementById('ipt-profile-email').value;
  document.getElementById('lbl-profile-college').textContent = document.getElementById('ipt-profile-college').value;
  document.getElementById('lbl-profile-course').textContent = document.getElementById('ipt-profile-course').value;
  document.getElementById('lbl-profile-about').textContent = document.getElementById('ipt-profile-about').value;
  document.getElementById('lbl-profile-goal').textContent = document.getElementById('ipt-profile-goal').value;
  
  const initials = document.getElementById('ipt-profile-name').value.split(' ').map(function(n) { return n[0]; }).join('').substring(0, 2).toUpperCase();
  document.getElementById('global-avatar-indicator').textContent = initials;
  document.getElementById('profile-avatar-node').textContent = initials;
  
  profileToggleEditView();
  triggerSystemToast("Identity verification metrics saved successfully.");
}

function profileChangeAvatar() {
  const av = prompt("Enter standard 2-letter monogram configuration:");
  if (av && av.length === 2) {
    document.getElementById('global-avatar-indicator').textContent = av.toUpperCase();
    document.getElementById('profile-avatar-node').textContent = av.toUpperCase();
    triggerSystemToast("Ecosystem baseline profile avatar shifted.");
  }
}

function handleLocalLogout() {
  if (confirm("Terminate client environment loops?")) {
    window.location.href = "index.html";
  }
}

/* --- Settings Storage Pipeline --- */
function systemInitializeConfigData() {
  const raw = localStorage.getItem(CONFIG_KEY);
  if (raw) {
    const d = JSON.parse(raw);
    document.getElementById('cfg-darkmode').checked = !!d.dark;
    document.getElementById('cfg-monochrome').checked = !!d.monochrome;
    document.getElementById('cfg-notify').checked = !!d.notify;
    document.getElementById('cfg-reminder').checked = !!d.reminder;
    document.getElementById('cfg-musicpref').checked = !!d.music;
    
    if (d.dark) document.body.classList.add('dark-mode-activated');
    if (d.monochrome) document.body.classList.add('monochrome-theme-activated');
  }
}

function applyImmediateSettingFeedback(type) {
  if (type === 'dark') {
    if (document.getElementById('cfg-darkmode').checked) document.body.classList.add('dark-mode-activated');
    else document.body.classList.remove('dark-mode-activated');
  }
  if (type === 'monochrome') {
    if (document.getElementById('cfg-monochrome').checked) document.body.classList.add('monochrome-theme-activated');
    else document.body.classList.remove('monochrome-theme-activated');
  }
  triggerSystemToast("Interim config track trace modification: " + type.toUpperCase());
}

function settingsSaveToStorage() {
  const b = {
    dark: document.getElementById('cfg-darkmode').checked,
    monochrome: document.getElementById('cfg-monochrome').checked,
    notify: document.getElementById('cfg-notify').checked,
    reminder: document.getElementById('cfg-reminder').checked,
    music: document.getElementById('cfg-musicpref').checked
  };
  localStorage.setItem(CONFIG_KEY, JSON.stringify(b));
  triggerSystemToast("Configuration baseline properties safely serialized to client storage logs.");
}

function settingsPurgeDefaults() {
  localStorage.removeItem(CONFIG_KEY);
  document.querySelectorAll('.toggle-switch-input').forEach(function(i) { i.checked = false; });
  document.body.classList.remove('dark-mode-activated');
  document.body.classList.remove('monochrome-theme-activated');
  triggerSystemToast("Parameters reverted to default structures.");
}