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
    
    countries = results.filter( c => c['Country/Region'] != 'US' && c['Country/Region'] != 'China' && c['Country/Region'] != 'Australia' )
    combined_america = combine_regions(results.filter( (result) => result['Country/Region'] == 'US' ))
    combined_china = combine_regions(results.filter( (result) => result['Country/Region'] == 'China' ))
    combined_australia = combine_regions(results.filter( (result) => result['Country/Region'] == 'Australia' ))

    countries.push(combined_america)
    countries.push(combined_china)
    countries.push(combined_australia)

    console.log(countries.length)
    countries = countries.filter(remove_negatives)

    console.log(countries.length)
  });


const combine_regions = (initial_regions) => {
  let combined = {}
  initial_regions.forEach(region => {
  _.forEach(region, (val, key) => {
      if(key != 'Country/Region' && key != 'Province/State' && key != 'Lat' && key != 'Long'){
        if( combined.hasOwnProperty(key) ) combined[key] += parseInt(val)
        else combined[key] = parseInt(val)
      }
    })
  });
  return combined
}

const remove_negatives = (country) => {
  let found_case = false
  _.forEach(country, (val, key) => {
    if( key != 'Country/Region' && key != 'Province/State' && key != 'Lat' && key != 'Long' ){
      if( parseInt(val) != 0)
        found_case = true
      
    }
  })
  return found_case
}
