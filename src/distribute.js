const {
  validateInput,
  getAllDepositPlanRatio,
  shouldAddMoneyToOneTimeDepositPlan,
  distributeAmount
} = require('./distribute.utils');

const getAllotment = ({ depositPlans, deposits }) => {
  validateInput(depositPlans);

  // Calculate deposit ratios to allot deposit money
  const { oneTimeDepositPlanRatio, monthlyDepositPlanRatio } = getAllDepositPlanRatio(depositPlans);

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
