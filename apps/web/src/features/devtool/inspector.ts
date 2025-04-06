import { createBrowserInspector } from '@statelyai/inspect';

// Conditionally create inspector based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const inspector = isDevelopment
  ? createBrowserInspector()
  : { inspect: undefined };

export const { inspect } = inspector;
