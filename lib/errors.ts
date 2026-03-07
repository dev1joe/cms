export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string // e.g., 'AUTH_FAILED'
  ) {
    super(message);
    this.name = "ApiError";
    // Essential for checking 'instanceof' in TypeScript
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class ResourceNotFoundError extends ApiError {
  constructor(
    public message: string = "Resource not found",
    public statusCode: number = 404,
    public code: string = "NOT_FOUND"
  ) {
    super(message, statusCode, code);
    this.name = "ResourceNotFoundError";
    // Essential for checking 'instanceof' in TypeScript
    Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
  }
}
