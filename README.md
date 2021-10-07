## Allot Deposit money

Lib which exposes a method called allocate to split deposits between deposit plans

#### Usage

Note: node > 13, es2020 doesn't work, use node~12
#### Install dependencies

```
npm ci
```

### Calling the lib

```
const { getAllotment } = require('./distribute');

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

const allotment = getAllotment(input);
// allotment = { risk: 10000, retirement: 600 }

# more examples in distribute.test.js
```

### Tests

```
npm run test
```

### Approach

Based on approach mentioned [here](https://www.stashaway.sg/faq/900000812366-how-does-my-money-get-allocated-if-i-have-multiple-portfolios-consisting-of-income-and-other-portfolios)

```
Memory and time complexity is O(N), N being the Max(length of deposits, number of portfolios in plan)
```
