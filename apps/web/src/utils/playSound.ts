import { logger } from './logger';

/**
 * Plays an MP3 sound file.
 * @param soundFile The path to the MP3 sound file.
 * @returns A Promise that resolves with the HTMLAudioElement instance when the sound starts playing, or rejects on error.
 */
export const playSound = (soundFile: string): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    if (typeof Audio === 'undefined') {
      logger.warn('Audio API is not supported in this environment.');
      reject(new Error('Audio API not supported'));
      return;
    }

    // Ensure /sounds/ prefix
    const src = soundFile;
    const audio = new Audio(src);
    audio.volume = 0.5; // Set default volume to 50%

    audio
      .play()
      .then(() => {
        resolve(audio); // Resolve with the audio instance
      })
      .catch((error) => {
        logger.error(`Error playing sound: ${src}`, error);
        reject(error);
      });

    audio.onerror = (e) => {
      logger.error(`Error loading sound: ${src}`, e);
      reject(new Error(`Failed to load sound: ${src}`));
    };
  });
};
