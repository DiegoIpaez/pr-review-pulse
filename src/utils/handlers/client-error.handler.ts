/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { ExternalToast, toast } from 'sonner';
import { CONFIG, NodeEnv } from '@/constants';

type ErrorHandlerOptions = {
  logToConsole?: boolean;
  showToast?: boolean;
  messagePrefix?: string;
  defaultMessage?: string;
  toastOptions?: Partial<ExternalToast>;
};

function normalizeError(error: unknown): Error {
  if (error instanceof AxiosError) {
    const isNetworkError = !error.response;
    return {
      name: 'AxiosError',
      message: isNetworkError
        ? 'A network error occurred. Please check your internet connection.'
        : error.response?.data?.message ||
          error.message ||
          'An error occurred with the server request. Please try again.',
      stack: error.response?.data?.stack || error.stack,
    };
  }
  if (error instanceof Error) return error;
  if (typeof error === 'string') return new Error(error);

  if (error && typeof error === 'object') {
    if ('message' in error && typeof (error as any).message === 'string') {
      return new Error((error as any).message);
    }
    return new Error(JSON.stringify(error));
  }

  return new Error('Unknown error');
}

/**
 * Handles client-side errors with configurable options
 * @param error - The captured error
 * @param callback - Optional function to execute after handling the error
 * @param options - Configuration options for the error handler
 */
export default function clientErrorHandler(
  error: unknown,
  callback = () => {},
  {
    showToast = true,
    messagePrefix = 'Error:',
    defaultMessage = 'An unknown error occurred.',
    toastOptions = { duration: 4000 },
  }: ErrorHandlerOptions = {}
): void {
  const normalizedError = normalizeError(error);

  // eslint-disable-next-line no-console
  if (CONFIG.NODE_ENV === NodeEnv.Development) console.error(normalizedError);
  if (showToast) {
    const displayMessage = normalizedError.message || defaultMessage;
    toast.error(messagePrefix, {
      description: displayMessage,
      ...toastOptions,
    });
  }

  callback();
}
