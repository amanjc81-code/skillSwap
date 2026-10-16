import { getRecommendationsForUser, findMultiPersonCycles } from '../services/matchingService.js';

export const getMatches = async (req, res, next) => {
  try {
    const recommendations = await getRecommendationsForUser(req.user._id);
    res.status(200).json({
      success: true,
      ...recommendations
    });
  } catch (error) {
    next(error);
  }
};

export const getExchangeCycles = async (req, res, next) => {
  try {
    const cycles = await findMultiPersonCycles(req.user._id, 3);
    res.status(200).json({
      success: true,
      cycles
    });
  } catch (error) {
    next(error);
  }
};

export const refreshMatches = async (req, res, next) => {
  try {
    const recommendations = await getRecommendationsForUser(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Recommendations updated.',
      ...recommendations
    });
  } catch (error) {
    next(error);
  }
};
