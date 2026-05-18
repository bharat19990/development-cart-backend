export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly messages: string | string[],
  ) {
    super(Array.isArray(messages) ? messages.join(', ') : messages);
    this.name = this.constructor.name;
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Invalid or missing token') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(403, message);
  }
}

export class ValidationRequestError extends AppError {
  constructor(messages: string[]) {
    super(400, messages);
  }
}
