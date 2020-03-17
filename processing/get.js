const csv = require('csv-parser')
const fs = require('fs')
const _ = require('lodash')

const mainThread = () => {
  let confirmed = [];
  let deaths = []
  let recovered = []
  let population_data = []

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
        fs.createReadStream('data/population_world_bank.csv')
        .pipe(csv())
        .on('data', data => { population_data.push(data) })
        .on('end', () => {  
          countries = merge_object(restructure_inputs(confirmed), restructure_inputs(deaths), restructure_inputs(recovered))
          countries = add_population_data(countries, population_data)
          
          // Relabel country names
          _.forEach(countries, (c) => {
            c.country_name = c.country_name == 'US' ? 'United States' : c.country_name == 'Korea, South' ? 'South Korea' : c.country_name
          })
          
          removed_key = _.map(countries, (country) => country)

          fs.writeFile("./output.json", JSON.stringify(removed_key , null, 2), function(err) {
            if(err) {
              return console.log(err);
            }
            console.log("The file was saved!");
          }); 
        })
      })
    }); 
  });
}

const add_population_data = (countries, population_data) => {
  _.forEach(countries, (data, country_name) => {
    population_data.forEach( (pop_data) => {
      if( pop_data['Country Name'].toLowerCase()  == country_name.toLowerCase() ){
        data.population = parseInt(pop_data['2018'])
        data.time_series.forEach( (time) => {
          if(time.confirmed)
            time.confirmed_per_mil = time.confirmed / (data.population / 1000000)
          if(time.deaths)
            time.deaths_per_mil = time.deaths / (data.population / 1000000)
          if(time.recovered)
            time.recovered_per_mil = time.recovered / (data.population / 1000000)
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
    const country_name = country['Country/Region']
    _.forEach(country, (val, key) => {
      if(validKey(key)){
        combined[country_name].time_series.forEach( (time) => {
          if(key == time.date)
            time.deaths = parseInt(val)
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
            time.recovered = parseInt(val)
        })
      }
    })
  })

  return combined

}

const restructure_inputs = (all_countries) => {
  countries = all_countries.filter( c => {
    return c['Country/Region'] != 'US' 
      && c['Country/Region'] != 'China' 
      && c['Country/Region'] != 'Australia' 
      && c['Country/Region'] != 'Canada' 
      && c['Country/Region'] != 'United Kingdom' 
  })


  countries.push(combine_regions(all_countries.filter( (result) => result['Country/Region'] == 'US'             )))
  countries.push(combine_regions(all_countries.filter( (result) => result['Country/Region'] == 'China'          )))
  countries.push(combine_regions(all_countries.filter( (result) => result['Country/Region'] == 'Australia'      )))
  countries.push(combine_regions(all_countries.filter( (result) => result['Country/Region'] == 'Canada'         )))
  countries.push(combine_regions(all_countries.filter( (result) => result['Country/Region'] == 'United Kingdom' )))
  
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


mainThread()