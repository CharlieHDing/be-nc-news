const ENV = process.env.NODE_ENV || 'development'
const devData = require('./development-data')
const testData = require('./test-data')

data = {
    test: testData,
    development: devData
}

module.exports = data[ENV]