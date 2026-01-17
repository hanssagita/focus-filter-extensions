export default defineBackground(() => {
  // Store the window ID
  let audioWindowId: number | null = null;

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
  });

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
