export const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const parsed = await schema.parseAsync(dataToValidate);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error.errors) {
        const formattedErrors = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.') || 'root';
          formattedErrors[path] = err.message;
        });
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid request data'
      });
    }
  };
};
