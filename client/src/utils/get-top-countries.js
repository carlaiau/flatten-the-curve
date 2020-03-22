
// This utility function returns the top countries after filtering depending on the field to sort, which country is active
// And the minimum days that the country has needed to been infected since the active countires infection level.
// min_days_ahead works if it set off by 3. Not sure what is going on here, but will resolve at some point
const GetTopCountries = ({countries, active_country, field, sort, limit}) => {
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
    .sort(      (a, b) => (a.highest[field] < b.highest[field]) ? (sort == 'worst' ? 1 : -1) : (sort == 'worst' ? -1 : 1) )
    .filter(    (c) => c.highest[field] > active_country.highest[field] )
    .slice(0, limit)
    
}

export default GetTopCountries