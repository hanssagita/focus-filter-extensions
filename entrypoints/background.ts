import { getTimerState, updateTimerState, DEFAULT_TIMER_STATE } from '../lib/storage';

export default defineBackground(() => {
  // Store the window ID
  let audioWindowId: number | null = null;

  // Initialize alarms
  browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'pomodoro_timer') {
      await handleTimerTick();
    }
  });

  // Listen for messages
  browser.runtime.onMessage.addListener(async (message) => {
    if (message.type === 'PLAY_AUDIO') {
      if (audioWindowId) {
        // Already open, focus it
        try {
          await browser.windows.update(audioWindowId, { focused: true });
        } catch (e) {
          audioWindowId = null; // Reset if window doesn't exist
          await createAudioWindow();
        }
      } else {
        await createAudioWindow();
      }
      return { success: true };
    }

    if (message.type === 'STOP_AUDIO') {
      if (audioWindowId) {
        try {
          await browser.windows.remove(audioWindowId);
        } catch (e) {
          // Ignore if already closed
        }
        audioWindowId = null;
      }
      return { success: true };
    }

    if (message.type === 'GET_AUDIO_STATUS') {
      if (!audioWindowId) return { isPlaying: false };
      try {
        await browser.windows.get(audioWindowId);
        return { isPlaying: true };
      } catch (e) {
        audioWindowId = null;
        return { isPlaying: false };
      }
    }

    // Timer Messages
    if (message.type === 'START_TIMER') {
      const state = await getTimerState();
      if ((state.status === 'work' || state.status === 'break') && state.startTime) {
        // Calculate exact end time
        const endTime = state.startTime + (state.duration * 60 * 1000);

        // Create alarm for the exact end time
        // chrome.alarms.create accepts 'when' (ms since epoch)
        await browser.alarms.create('pomodoro_timer', { when: endTime });

        // Optional: Create a repeating alarm for badge updates if we want minute-by-minute updates
        // But we might just rely on the end alarm for the notification, 
        // and maybe a separate repeating one for the badge if needed.
        // For now, let's just ensure the END works.
        await browser.alarms.create('pomodoro_badge', { periodInMinutes: 1 });

        await handleTimerTick(); // Update immediately
      }
    }

    if (message.type === 'PAUSE_TIMER' || message.type === 'RESET_TIMER') {
      await browser.alarms.clear('pomodoro_timer');
      await browser.alarms.clear('pomodoro_badge');
      await browser.action.setBadgeText({ text: '' });
    }
  });

  async function handleTimerTick() {
    const state = await getTimerState();

    if (state.status === 'idle' || state.status === 'paused') {
      await browser.alarms.clear('pomodoro_timer');
      await browser.alarms.clear('pomodoro_badge');
      await browser.action.setBadgeText({ text: '' });
      return;
    }

    if (!state.startTime) return;

    const now = Date.now();
    const endTime = state.startTime + (state.duration * 60 * 1000);
    const remainingMs = endTime - now;
    const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));

    if (remainingMs <= 0) {
      // Timer finished
      await browser.alarms.clear('pomodoro_timer');
      await browser.alarms.clear('pomodoro_badge');
      await browser.action.setBadgeText({ text: 'DONE' });
      await browser.action.setBadgeBackgroundColor({ color: '#4CAF50' }); // Green

      // Notification
      browser.notifications.create({
        type: 'basic',
        iconUrl: browser.runtime.getURL('icon/128.png' as any),
        title: state.status === 'work' ? 'Work Session Complete!' : 'Break Over!',
        message: state.status === 'work'
          ? 'Great job! Time for a break.'
          : 'Break is over. Ready to focus?',
        priority: 2,
        requireInteraction: true
      });

      // Update state to completed so UI stays visible
      await updateTimerState({
        status: 'completed',
        previousStatus: state.status as 'work' | 'break',
        startTime: null,
        remainingTime: 0
      });
    } else {
      // Update badge
      await browser.action.setBadgeText({ text: remainingMinutes > 0 ? remainingMinutes.toString() : '<1' });
      // Color based on status
      const color = state.status === 'work' ? '#FF5252' : '#2196F3'; // Red for work, Blue for break
      await browser.action.setBadgeBackgroundColor({ color });
    }
  }

  async function createAudioWindow() {
    const window = await browser.windows.create({
      url: browser.runtime.getURL('player.html' as any),
      type: 'popup',
      width: 400,
      height: 600,
      focused: true
    });
    audioWindowId = window?.id || null;
  }

  // Clean up if the user closes the window manually
  browser.windows.onRemoved.addListener(async (windowId) => {
    if (windowId === audioWindowId) {
      audioWindowId = null;
      // Notify all views (like the popup) that audio stopped
      try {
        await browser.runtime.sendMessage({ type: 'AUDIO_STATUS_CHANGED', isPlaying: false });
      } catch (e) {
        // Ignore if no listeners
      }
    }
  });
});
