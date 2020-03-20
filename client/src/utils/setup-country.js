import { isValid, format ,parseJSON } from "date-fns"

const SetupCountry = ({country, field}) => {
    country.time_series.forEach( (time, i) => {
            if(country.highest && time[field] > country.highest[field])
                country.highest = time        
            else if(!country.highest)
                country.highest = time
        if(isValid(parseJSON(time.date)))
            time.date_string = format(parseJSON(time.date), 'dd/MM')
    })
    return country
}

export default SetupCountry