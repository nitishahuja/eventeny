export function errorHandler(err, req, res, next) {
  const statusCode = Number.isInteger(err?.statusCode) ? err.statusCode : 500;
  const message =
    statusCode === 500 ? 'Internal server error' : err?.message || 'Error';

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    ok: false,
    message,
  });
}

