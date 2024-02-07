/**
 * Logger interface
 * @interface
 * @name ILogger
 * @property {function} debug - Log debug message
 * @property {function} log - Log message
 * @property {function} error - Log error message
 * @property {function} warn - Log warning message
 * @property {function} verbose - Log verbose message
 */
export interface ILogger {
  debug(context: string, message: string): void;
  log(context: string, message: string): void;
  error(context: string, message: string, trace?: string): void;
  warn(context: string, message: string): void;
  verbose(context: string, message: string): void;
}
