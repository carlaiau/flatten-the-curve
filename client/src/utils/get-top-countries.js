
// This utility function returns the top countries after filtering depending on the field to sort, which country is active
// And the minimum days that the country has needed to been infected since the active countires infection level.

const GetTopCountries = ({max_count, countries, active_country, field, sort}) => {
    countries.forEach( (country) => {
        let earliest = {}
        let highest = {}
        let index_when_exceeds_active = 0

        country.time_series.forEach( (time, i) => {
          if( earliest.hasOwnProperty(field) ){
            if(time[field] < earliest[field] && ( time[field] >= active_country.highest[field]) ){  
              earliest = time
              index_when_exceeds_active = i
            }
          }
          else if(! earliest.hasOwnProperty(field) && time[field] >= active_country.highest[field]){
            earliest = time
            index_when_exceeds_active = i
          }

          if( highest.hasOwnProperty(field) && time[field] > highest[field] )
            highest = time
          else if(! highest.hasOwnProperty(field) )
            highest = time
        })
        country.earliest = earliest
        country.highest = highest
        country.days_ahead_of_active = country.time_series.length  - (index_when_exceeds_active + 1)
        
    })
    
    return countries
    .sort(      (a, b) => {
      if(sort == 'alpha_asc' || sort == 'alpha_desc')  return a.country_name < b.country_name ? (sort == 'alpha_asc'? -1: 1) : (sort == 'alpha_asc'? 1: -1)
      return (a.highest[field] < b.highest[field]) ? (sort == 'worst' ? 1 : -1) : (sort == 'worst' ? -1 : 1) 
      })
    .filter(    (c) => c.highest[field] > active_country.highest[field] )
    .slice(0, max_count)
    
}

export default GetTopCountries