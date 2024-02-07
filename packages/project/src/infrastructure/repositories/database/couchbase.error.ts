/**
 * Get the error message from the error object
 * @param error
 * @returns error message string
 */
export function getErrorMessage(error: any): string {
  if (error && error.cause && error.cause.first_error_message) {
    return error.cause.first_error_message;
  } else if (error && error.message) {
    return error.message;
  } else {
    return 'Unknown error occurred';
  }
}
