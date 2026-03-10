export function notFoundHandler(req, res) {
  res.status(404).json({
    ok: false,
    message: 'Not found',
    path: req.originalUrl,
  });
}

