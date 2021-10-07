const { getAllotment } = require('./distrbute')
const assert = require('assert');
const { expect } = require('chai');

const getTotalAmount = (listOfNum) => listOfNum.reduce((acc, currValue) => acc + currValue , 0)

describe('getAllotment', () => {
  it('should return expected result : example case', () => {
    // GIVEN
    const input = {
      depositPlans: {
          oneTime: {
            'risk': 10000,
            'retirement': 500
          },
          monthly: {
            'risk': 0,
            'retirement': 100
          }
        },
      deposits: [10500, 100]
    }

    // WHEN
    const result = getAllotment(input);
    
    // THEN
    expect(result).deep.equal({ risk: 10000, retirement: 600 })
    expect(getTotalAmount(Object.values(result))).deep.equal(getTotalAmount(input.deposits))
  })

  it('should split rightly with multiple deposits', () => {
    // GIVEN
    const input = {
      depositPlans: {
              oneTime: {
                'risk': 12000,
                'retirement': 1500
              },
              monthly: {
                'risk': 1000,
                'retirement': 100
              }
            },
          deposits: [10500, 100, 100, 1000, 4000]
      }

    // WHEN
    const result = getAllotment(input);
    
    // THEN
    expect(result).deep.equal({ risk: 13955.555555555555, retirement: 1744.4444444444443 })
    expect(getTotalAmount(Object.values(result))).deep.equal(getTotalAmount(input.deposits))
  })

  it('should split rightly with multiple lesser deposit money over deposit plans', () => {
    // GIVEN
    const input = {
        depositPlans: {
          oneTime: {
            'risk': 50
          },
          monthly: {
            'risk': 500,
            'party': 45,
          }
        },
        deposits: [66.5]
      }

    // WHEN
    const result = getAllotment(input)
    
    // THEN
    expect(result).deep.equal({ risk: 66.5, party: 0 })
    expect(getTotalAmount(Object.values(result))).deep.equal(getTotalAmount(input.deposits))
  })

  it('should split rightly with more deposit money than depo plans', () => {
    // GIVEN
    const input = {
        depositPlans: {
          oneTime: {
            'risk': 50
          },
          monthly: {
            'risk': 500,
            'party': 45,
          }
        },
        deposits: [66.5, 10000, 5000, 3000]
      }

    // WHEN
    const result = getAllotment(input)
    
    // THEN
    expect(result).deep.equal({ risk: 16580.261467889908, party: 1486.2385321100917 })
    expect(getTotalAmount(Object.values(result))).deep.equal(getTotalAmount(input.deposits))
  })

  it('should split rightly with just monthly deposit plan', () => {
    // GIVEN
    const input = {
        depositPlans: {
          monthly: {
            'risk': 50,
            'party': 45,
          }
        },
        deposits: [66.5, 10000, 5000, 3000]
      }

    // WHEN
    const result = getAllotment(input)
    
    // THEN
    expect(result).deep.equal({ risk: 9508.684210526315, party: 8557.815789473683 })
    expect(getTotalAmount(Object.values(result))).deep.equal(getTotalAmount(input.deposits))
  })

  it('should split rightly with just onetime deposit plan', () => {
    // GIVEN
    const input = {
        depositPlans: {
          oneTime: {
            'risk': 50,
            'party': 45,
          }
        },
        deposits: [66.5, 10000, 5000, 3000]
      }

    // WHEN
    const result = getAllotment(input)
    
    // THEN
    expect(result).deep.equal({ risk: 9508.684210526315, party: 8557.815789473683 })
    expect(getTotalAmount(Object.values(result))).deep.equal(getTotalAmount(input.deposits))
  })

  it('should return empty deposit if deposits made are empty', () => {
    // GIVEN
    const input = {
        depositPlans: {
          oneTime: {
            'risk': 50,
            'party': 45,
          }
        },
        deposits: []
      }

    // WHEN
    const result = getAllotment(input)
    
    // THEN
    expect(result).deep.equal({})
    expect(getTotalAmount(Object.values(result))).deep.equal(0)
  })

  it('should throw error if none of monthly or onetime deposit plans exists', () => {
    // GIVEN
    const input = {
        depositPlans: {
        },
        deposits: [10, 200, 1000]
      }
  
    // WHEN
    let result;
    try {
      getAllotment(input)
    } catch (error) {
      result = error.toString()
    }
    
    // THEN
    expect(result).deep.equal('Error: Either of oneTime, monthly deposit plans are needed!')
  })

  it('should add money excess money crossing the depo plans to monthly plan', () => {
    // GIVEN
    const input = {
        depositPlans: {
          oneTime: {
            'risk': 50,
            'party': 50,
          },
          monthly: {
            'party': 45,
            'retirement': 1000
          },
        },
        deposits: [10, 200, 1000, 2000]
      }
  
    // WHEN
    const result = getAllotment(input)
    
    // THEN
    expect(result).deep.equal({ risk: 105, party: 234.1866028708134, retirement: 2870.813397129187 })
    expect(getTotalAmount(Object.values(result))).deep.equal(getTotalAmount(input.deposits))
  })


  it('should split accordingly when portpolio plans are different in oneTime and monthly plans ', () => {
    // GIVEN
    const input = {
        depositPlans: {
          oneTime: {
            'chill': 50,
            'party': 50,
          },
          monthly: {
            'carSavings': 45,
            'retirement': 1000
          },
        },
        deposits: [77, 10, 200, 1000]
      }
  
    // WHEN
    const result = getAllotment(input)
        
    // THEN
    expect(result).deep.equal({
      chill: 143.5,
      party: 143.5,
      carSavings: 43.0622009569378,
      retirement: 956.9377990430622
    })
    expect(getTotalAmount(Object.values(result))).deep.equal(getTotalAmount(input.deposits))
  })
})

