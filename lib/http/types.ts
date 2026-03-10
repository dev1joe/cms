export interface ApiResponseBody<T = []> {
  success: boolean,
  message: string,
  result?: T,
  errors?: Record<string, string[]>,
}
