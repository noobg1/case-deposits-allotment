const {
  getDepositPlanTotal,
  getDepositPlanRatio,
  shouldAddMoneyToOneTimeDepositPlan,
  distributeAmount
} = require('./utils');

const getAllotment = ({ depositPlans, deposits }) => {
  if (!depositPlans.oneTime && !depositPlans.monthly) {
    // if both onetime, monthly deposits plan doesn't exist throw error
    throw new Error('Either of oneTime, monthly deposit plans are needed!');
  }

  // Get one-time deposit portfolio total, ratio
  const oneTimeDepositPlanTotal = getDepositPlanTotal(depositPlans.oneTime);
  const oneTimeDepositPlanRatio = getDepositPlanRatio(depositPlans.oneTime, oneTimeDepositPlanTotal);

  // Get monthly deposit portfolio total, ratio
  const monthlyDepositPlanTotal = getDepositPlanTotal(depositPlans.monthly);
  const monthlyDepositPlanRatio = getDepositPlanRatio(depositPlans.monthly, monthlyDepositPlanTotal);

  // Create allotment for each deposit
  let allotment = {};
  deposits.forEach(deposit => {
    let balance = deposit;
    
    // First Distribute to oneTime depo plans
    for (const oneTimeDepositPlan in oneTimeDepositPlanRatio) {
      if (shouldAddMoneyToOneTimeDepositPlan(allotment, oneTimeDepositPlan, depositPlans)) {
        const result = distributeAmount(deposit, oneTimeDepositPlan, oneTimeDepositPlanRatio, allotment);
        allotment = result.portfolio;
        balance -= result.amountToAdd;
      }
    }

    // Next distribute remaining money to monthly plans
    for (const monthlyTimeDepositPlan in monthlyDepositPlanRatio) {
      const result = distributeAmount(balance, monthlyTimeDepositPlan, monthlyDepositPlanRatio, allotment);
      allotment = result.portfolio;
    }
  });

  return allotment;
};

module.exports = { getAllotment };
