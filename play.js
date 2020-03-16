const csv = require('csv-parser')
const fs = require('fs')
const results = [];
const _ = require('lodash')

fs.createReadStream('data/time_series_19-covid-Confirmed.csv')
  .pipe(csv())
  .on('data', (data) => {
        results.push(data)
  })
  .on('end', () => {    

    let american_results = []


    american_results =      results.filter( (result) => result['Country/Region'] == 'US' )
    chinese_results =       results.filter( (result) => result['Country/Region'] == 'China' )
    australian_results =    results.filter( (result) => result['Country/Region'] == 'Australia' )
    
    console.log("american results", american_results.length)
    console.log("chinese results", chinese_results.length)
    console.log("australian results", australian_results.length)



  });
