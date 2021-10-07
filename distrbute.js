const getDepositPlanTotal = (depositPlans) => {
  let depositPlanTotal = 0
  
  for (const depositPlan in depositPlans) {
    depositPlanTotal += depositPlans[depositPlan]
  }
  return depositPlanTotal
}

const getDepositPlanRatio = (depositPlans, depositPlanTotal) => {
  const oneTimeDepositPlanRatio = {}
  for (const depositPlan in depositPlans) {
    oneTimeDepositPlanRatio[depositPlan] = depositPlans[depositPlan] / depositPlanTotal
  }

  return oneTimeDepositPlanRatio
}

const shouldAddMoneyToOneTimeDepositPlan = (portfolio, oneTimeDepositPlan, depositPlans) => {
  // if in current portfolio no money is added for the deposit plan then add money to one time depo
  return !portfolio[oneTimeDepositPlan] ||
    // if in current portfolio amount is less than the limit of the portfolio itself then add money to one time depo
    portfolio[oneTimeDepositPlan] < depositPlans?.oneTime[oneTimeDepositPlan] ||
    // if no monthly exists so put all money in onetime deposit plan then add money to one time depo
    !depositPlans?.monthly
}

const distributeAmount = (amountToDistribute, portfolioName, depositPlanRatio, portfolio) => {
  const portfolioClone = {...portfolio}
  const amountToAdd = amountToDistribute * depositPlanRatio[portfolioName]
  portfolioClone[portfolioName] = portfolioClone[portfolioName] ?
  portfolioClone[portfolioName] + amountToAdd : amountToAdd
  return { portfolio: portfolioClone, amountToAdd }
}

const getAllotment = ({ depositPlans, deposits }) => {
  if (!depositPlans.oneTime && !depositPlans.monthly) {
    // if both onetime, monthly deposits plan doesn't exist throw error
    throw new Error('Either of oneTime, monthly deposit plans are needed!')
  }

  let portfolio = {}
  // Get one-time deposit portfolio total, ratio
  const oneTimeDepositPlanTotal = getDepositPlanTotal(depositPlans?.oneTime)
  const oneTimeDepositPlanRatio = getDepositPlanRatio(depositPlans?.oneTime, oneTimeDepositPlanTotal)

  // Get monthly deposit portfolio total, ratio
  const monthlyDepositPlanTotal = getDepositPlanTotal(depositPlans?.monthly)
  const monthlyDepositPlanRatio = getDepositPlanRatio(depositPlans?.monthly, monthlyDepositPlanTotal)

 
  deposits.forEach(deposit => {
    let balance = deposit
    
    // First Distribute to oneTime depo plans
    for (oneTimeDepositPlan in oneTimeDepositPlanRatio) {
      if (shouldAddMoneyToOneTimeDepositPlan(portfolio, oneTimeDepositPlan, depositPlans)) {
        const result = distributeAmount(deposit, oneTimeDepositPlan, oneTimeDepositPlanRatio, portfolio)
        portfolio = result.portfolio
        balance -= result.amountToAdd
      }
    }

    // Next distribute remaining money to monthly plans
    let balancePostDistribution = balance
    for (monthlyTimeDepositPlan in monthlyDepositPlanRatio) {
      const result = distributeAmount(balance, monthlyTimeDepositPlan, monthlyDepositPlanRatio, portfolio)
      portfolio = result.portfolio
      balancePostDistribution -= result.amountToAdd
    }
  })

  return portfolio
}

module.exports = { getAllotment }
