const csv = require('csv-parser')
const fs = require('fs')

const _ = require('lodash')

let confirmed = [];
let deaths = []
let recovered = []
fs.createReadStream('data/time_series_19-covid-Confirmed.csv')
.pipe(csv())
.on('data', data => { confirmed.push(data) })
.on('end', () => {    
  fs.createReadStream('data/time_series_19-covid-Deaths.csv')
  .pipe(csv())
  .on('data', data => { deaths.push(data) })
  .on('end', () => {    
    fs.createReadStream('data/time_series_19-covid-Recovered.csv')
    .pipe(csv())
    .on('data', data => { recovered.push(data) })
        .on('end', () => {    
          mainThread()
        });
      });    
  });


const mainThread = () => {
  countries = merge_object(restructure_inputs(confirmed), restructure_inputs(deaths), restructure_inputs(recovered))
  console.log(JSON.stringify(countries, null, 2))
}
const merge_object = (confirmed, deaths, recovered) => {
  let combined = {}
  
  confirmed.forEach( (country) => {
    const country_name = country['Country/Region']
    highest_confirmed = 0
    time_series = []
    _.forEach(country, (val, key) => {
      if(validKey(key)){
        time_series.push( { 
          date: key, confirmed: val 
        } )
        if(val > highest_confirmed)
          highest_confirmed = val
      }
    })
    combined[country_name] = { time_series, highest_confirmed }
  })

  deaths.forEach( (country) => {
    const country_name = country['Country/Region']
    _.forEach(country, (val, key) => {
      if(validKey(key)){
        combined[country_name].time_series.forEach( (time) => {
          if(key == time.date)
            time.deaths = val
        })
      }
    })
  })

  recovered.forEach( (country) => {
    const country_name = country['Country/Region']
    _.forEach(country, (val, key) => {
      if(validKey(key)){
        combined[country_name].time_series.forEach( (time) => {
          if(key == time.date)
            time.recovered = val
        })
      }
    })
  })

  return combined

}

const restructure_inputs = (all_countries) => {
  countries = all_countries.filter( c => c['Country/Region'] != 'US' && c['Country/Region'] != 'China' && c['Country/Region'] != 'Australia' )
  combined_america = combine_regions(all_countries.filter( (result) => result['Country/Region'] == 'US' ))
  combined_china = combine_regions(all_countries.filter( (result) => result['Country/Region'] == 'China' ))
  combined_australia = combine_regions(all_countries.filter( (result) => result['Country/Region'] == 'Australia' ))

  countries.push(combined_america)
  countries.push(combined_china)
  countries.push(combined_australia)

  
  return countries.filter(remove_negatives)
}


const combine_regions = (initial_regions) => {
  let combined = {}
  initial_regions.forEach(region => {
  _.forEach(region, (val, key) => {
      if(validKey(key)){
        if( combined.hasOwnProperty(key) ) 
          combined[key] += parseInt(val)
        else 
          combined[key] = parseInt(val)
      }
      else if(key == 'Country/Region')
        combined[key] = val
    })
  });
  return combined
}

const remove_negatives = (country) => {
  let found_case = false
  _.forEach(country, (val, key) => {
    if(validKey(key))
      if( parseInt(val) != 0) 
        found_case = true 
    
  })
  return found_case
}

const validKey = (key) => key != 'Country/Region' && key != 'Province/State' && key != 'Lat' && key != 'Long'
