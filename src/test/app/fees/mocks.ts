import * as mock from 'mock-require'

mock('fees/feesClient', {
  'default': {
    calculateIssueFee: (amount) => Promise.resolve(100),
    calculateMaxIssueFee: () => Promise.resolve(1000000)
  }
})
