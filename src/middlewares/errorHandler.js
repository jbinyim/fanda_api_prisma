const errorHandler = (error, req, res, next) => {
  const status = error.code ?? 500;

  console.error(error);
  return res.status(status).json({
    path: req.path,
    method: req.method,
    message: error.message ?? "Server Error",
    data: error.data ?? undefined,
    date: new Date(),
  });
};

export default errorHandler;
