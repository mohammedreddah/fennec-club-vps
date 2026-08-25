import { ApiError } from '../utils/apiResponse.js';

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details ?? undefined,
    });
  }

  // node-postgres (pg) errors carry a Postgres `code` and `message`.
  if (err && err.code && err.message) {
    const status = err.code === '23505' ? 409 : err.code === '23503' ? 409 : 400;
    return res.status(status).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  // eslint-disable-next-line no-console
  console.error('Unexpected error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
