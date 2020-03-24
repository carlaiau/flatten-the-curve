const csv = require('csv-parser')
const fs = require('fs')
const _ = require('lodash')
const request = require('request')
const { parse } = require('date-fns')

const createFiles = (country_path, cum_path) => {
  let confirmed = [];
  let deaths = []
  let recovered = []
  let population_data = []

  request('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv')
  .pipe(csv())
  .on('data', data => { confirmed.push(data) })
  .on('end', () => {    
    request('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv')
    .pipe(csv())
    .on('data', data => { deaths.push(data) })
    .on('end', () => {    
      fs.createReadStream('data/population_world_bank.csv')
      .pipe(csv())
      .on('data', data => { population_data.push(data) })
      .on('end', () => {  
        countries = merge_object(
          restructure_inputs(confirmed), 
          restructure_inputs(deaths), 
        )
        countries = add_population_data(countries, population_data)
        
        // Relabel country names
        _.forEach(countries, (c) => {
          c.country_name = c.country_name == 'US' ? 'United States' : c.country_name == 'Korea, South' ? 'South Korea' : c.country_name
        })
        
        country_array = _.map(countries, (country) => country)

        const cumulative = getCumulatives(country_array)
        
        fs.writeFile(country_path, JSON.stringify(country_array , null, 2), function(err) {
          if(err) return console.log(err);
          console.log("Country file was saved!");
        }); 
        fs.writeFile(cum_path, JSON.stringify(cumulative, null, 2), function(err) {
          if(err) return console.log(err);
          console.log("Cumulative was saved!");
        }); 
        
      })
    })
  });
}

const add_population_data = (countries, population_data) => {
  
  // Remove the empty time series data
  _.forEach(countries, (data) => {
    data.time_series = data.time_series.filter( (t) => t.confirmed != 0 )
  })

  // convert stupid date strings to actual dates 
  _.forEach(countries, (data) => {
    data.time_series.map( (t) => {
      t.date = parse(t.date, 'MM/dd/yy', new Date() )
    })
  })

  _.forEach(countries, (data, country_name) => {
    population_data.forEach( (pop_data) => {
      if( pop_data['Country Name'].toLowerCase()  == country_name.toLowerCase() ){
        data.population = parseInt(pop_data['2018'])
        data.time_series.forEach( (time) => {
          if(time.confirmed)
            time.confirmed_per_mil = time.confirmed / (data.population / 1000000)
          if(time.deaths)
            time.deaths_per_mil = time.deaths / (data.population / 1000000)
        })      
      }
    })
  })
  return countries
}

const merge_object = (confirmed, deaths, recovered) => {
  let combined = {}
  
  confirmed.forEach( (country) => {
    let country_name = country['Country/Region'] 
    
    
    highest_confirmed = 0
    
    time_series = []
    _.forEach(country, (val, key) => {
      if(validKey(key)){
        time_series.push( { 
          date: key, confirmed: parseInt(val)
        } )
        if(val > highest_confirmed)
          highest_confirmed = parseInt(val)
      }
    })
    combined[country_name] = { country_name, time_series, highest_confirmed }
  })

  deaths.forEach( (country) => {
    highest_deaths = 0
    const country_name = country['Country/Region']
    _.forEach(country, (val, key) => {
      if(validKey(key)){
        if(combined.hasOwnProperty(country_name)){
          combined[country_name].time_series.forEach( (time) => {
            if(key == time.date){
              time.deaths = parseInt(val)
              if(val > highest_deaths)
                highest_deaths = parseInt(val)
            }
          })
          combined[country_name].highest_deaths = highest_deaths

        }
        
      }
    })
  })

  return combined

}

const restructure_inputs = (all_countries) => {

  const seen_countries = []
  all_countries.forEach( c => {
    const found = _.find( seen_countries, (seen_country) => seen_country.name == c['Country/Region'] );
    if(found){
      found.count += 1
    }
    else{
      seen_countries.push({
        name: c['Country/Region'],
        count: 1
      })
    }

  })
  
  countries_multiple_column_names = seen_countries.filter( (c) => c.count > 1 ).map( c => c.name)

  countries = all_countries.filter( c => ! countries_multiple_column_names.includes(c) )

  countries_multiple_column_names.forEach( country_name => {
    countries.push(combine_regions(all_countries.filter( (result) => result['Country/Region'] == country_name)))
  })
  
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

// Country Logic = Cumulative number of cases, by number of days since 100th case
// Death Logic = cumulative number of deaths, by number of days since 10th deaths
const getCumulatives = (countries) => {
  const max_days = 30
  const output_countries = []

  const confirmed_ranges = [50, 100, 500, 1000]
  const death_ranges = [10, 50, 100, 500]
  // The structure needs to e 
  // We get an array of countries
  
  countries.forEach(country => {
    
    const confirmed = []
    const deaths = []
    
    confirmed_ranges.forEach(range => {
      let count_of_days = 0
      const confirmed_for_range = []

      country.time_series.forEach(day => {
        if(day.confirmed >= range && count_of_days <= max_days){
          confirmed_for_range.push({
            num_day: count_of_days,
            date: day.date,
            confirmed: day.confirmed
          })
          count_of_days++
        }
      })
      confirmed.push({
        range,
        time_series: confirmed_for_range
      })
    })

    death_ranges.forEach(range => {
      count_of_days = 0
      deaths_for_range = []
      country.time_series.forEach(day => {
        if(day.hasOwnProperty('deaths') && day.deaths >= range && count_of_days <= max_days){
          deaths_for_range.push({
            num_day: count_of_days,
            date: day.date,
            deaths: day.deaths
          })
          count_of_days++
        }
      })
      deaths.push({
        range,
        time_series: deaths_for_range
      })
    })

    // Either array is populated. Then append country to cumulative output
    if(confirmed.length || deaths.length){ 
      const country_to_append = {
        highest_confirmed: country.highest_confirmed,
        highest_deaths: country.highest_deaths,
        population: country.population,
        country_name: country.country_name,
      }

      if(confirmed.length) country_to_append.confirmed = confirmed
      if(deaths.length) country_to_append.deaths = deaths
      
      output_countries.push(country_to_append)
    }
    
  })

  return output_countries

}




if(process.argv.length == 4 ){
  createFiles(process.argv[2], process.argv[3])
}
else{
  console.log("Whoops!Usage:\nnode get.js country.out cumulative.out")
}
