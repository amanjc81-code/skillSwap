import {
  getCollegeOverviewStats,
  getSkillDemandAndCapacityAnalytics,
  getSessionTrends
} from '../services/analyticsService.js';

export const getOverview = async (req, res, next) => {
  try {
    const stats = await getCollegeOverviewStats();
    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    next(error);
  }
};

export const getSkillDemand = async (req, res, next) => {
  try {
    const analytics = await getSkillDemandAndCapacityAnalytics();
    res.status(200).json({
      success: true,
      ...analytics
    });
  } catch (error) {
    next(error);
  }
};

export const getSessionOutcomes = async (req, res, next) => {
  try {
    const trends = await getSessionTrends();
    res.status(200).json({
      success: true,
      trends
    });
  } catch (error) {
    next(error);
  }
};

export const exportAggregateReport = async (req, res, next) => {
  try {
    const stats = await getCollegeOverviewStats();
    const analytics = await getSkillDemandAndCapacityAnalytics();
    const trends = await getSessionTrends();

    const report = {
      institution: 'MIT ACSC TYBCA Field Project Evaluation',
      generatedAt: new Date().toISOString(),
      privacyCompliance: 'Aggregated statistics only. Individual identifiers omitted.',
      overview: stats,
      skillDemandAndCapacity: analytics.skillStats.map((s) => ({
        skillName: s.skillName,
        category: s.category,
        learnerDemand: s.learnerCount,
        teachingCapacityMentors: s.mentorCount,
        totalCapacityHours: s.totalCapacityHours,
        supportDeficit: s.deficit
      })),
      sessionTrends: trends.statusBreakdown
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="skillmesh-college-report.json"');
    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};
