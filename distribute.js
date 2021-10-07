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
