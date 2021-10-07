const getDepositPlanTotal = (depositPlans) => {
  let depositPlanTotal = 0;
  for (const depositPlan in depositPlans) {
    depositPlanTotal += depositPlans[depositPlan];
  }
  return depositPlanTotal;
};

const getDepositPlanRatio = (depositPlans, depositPlanTotal) => {
  const oneTimeDepositPlanRatio = {};
  for (const depositPlan in depositPlans) {
    oneTimeDepositPlanRatio[depositPlan] = depositPlans[depositPlan] / depositPlanTotal;
  }
  return oneTimeDepositPlanRatio;
};

const shouldAddMoneyToOneTimeDepositPlan = (portfolio, oneTimeDepositPlan, depositPlans) => {
  // if in current portfolio no money is added for the deposit plan then add money to one time depo
  return !portfolio[oneTimeDepositPlan] ||
    // if in current portfolio amount is less than the limit of the portfolio itself then add money to one time depo
    portfolio[oneTimeDepositPlan] < depositPlans.oneTime[oneTimeDepositPlan] ||
    // if no monthly exists so put all money in onetime deposit plan then add money to one time depo
    !depositPlans.monthly;
};

const distributeAmount = (amountToDistribute, portfolioName, depositPlanRatio, portfolio) => {
  const portfolioClone = { ...portfolio };
  const amountToAdd = amountToDistribute * depositPlanRatio[portfolioName];
  portfolioClone[portfolioName] = (portfolioClone[portfolioName] || 0) + amountToAdd;
  return { portfolio: portfolioClone, amountToAdd };
};

module.exports = {
  getDepositPlanTotal,
  getDepositPlanRatio,
  shouldAddMoneyToOneTimeDepositPlan,
  distributeAmount
};
