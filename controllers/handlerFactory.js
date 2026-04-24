const AppError = require('../utils/appError');

exports.deleteOne = (Model) => async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);
  const modelName =
    Model.modelName.charAt(0).toLowerCase() + Model.modelName.slice(1);

  if (!doc) {
    return next(new AppError(`No ${modelName} found with that ID`, 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
