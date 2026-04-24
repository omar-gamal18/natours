const AppError = require('../utils/appError');

const nameOfModel = (Model) =>
  Model.modelName.charAt(0).toLowerCase() + Model.modelName.slice(1);

exports.deleteOne = (Model) => async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(
      new AppError(`No ${nameOfModel(Model)} found with that ID`, 404),
    );
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

exports.updateOne = (Model) => async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });
  const modelName = nameOfModel(Model);

  if (!doc) {
    return next(new AppError(`No ${modelName} found with that ID`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      modelName: doc,
    },
  });
};

exports.createOne = (Model) => async (req, res, next) => {
  const newDocument = await Model.create(req.body);
  const modelName = nameOfModel(Model);
  res.status(201).json({
    status: 'success',
    data: {
      modelName: newDocument,
    },
  });
};
