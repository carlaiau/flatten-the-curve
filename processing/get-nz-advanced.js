const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs')
const _ = require('lodash')
const { parse, format, parseISO } = require('date-fns')
var addDays = require('date-fns/addDays')
const differenceInCalendarDays = require('date-fns/differenceInCalendarDays')

// Sometimes the MoH uploads two of the same table to the page...
// This is rudimentary way of checking that we're not scraping from same table more than once.
// Without using xpath or anything complicated
const getCases = (html) => {
    const $ = cheerio.load(html);
    const row_counts_encountered = []
    cases = []
    $('.table-style-two tbody').each(function(i , t){
        const rows = $(this).children('tr')
        // Prevent duplication when MoH adds same table twice, this will obviously break if
        // confirmed count == probable count
        if(! row_counts_encountered.includes(rows.length)){
            $(rows).each(function(){

                const cells = []
                // Extract each td into cells array
                $(this).children('td').each(function(){
                    cells.push($(this).text())
                })
                
                cases.push({
                    original_date: cells[0].trim(),
                    gender: cells[1].trim(),
                    age: cells[2].trim(),
                    district: cells[3].trim(),
                    travel: cells[4].trim(),
                    last_country: cells[5].trim(),
                    arrival_date: cells[6].trim(),
                    flight_departure_date: cells[7].trim(),
                    flight_number: cells[8].trim(),
                    type: i == 0 ? 'confirmed' : 'probable',
                    
                })
                    
            })


            

            row_counts_encountered.push(rows.length)


        }

    })
    return cases
}

const addDateTransformation = (cases) => {
    cases.forEach( c => {
        const dateObject = parse(c.original_date, 'dd/MM/yyyy', new Date())
        c.dateObject = format(dateObject,'yyyy-MM-dd') + 'T00:00:00.000Z'
        c.dateForSort = format(dateObject,'yyyyMMdd')
    })
    return cases
}

const createStructuredCases = (cases_by_district) => {
    // Go through the cases_by_district
    cases_by_district.forEach(d => {
        // Later turn into array. Map is easier initally
        d.structured_cases = {} 
        d.cases.forEach(c => {
            if( d.structured_cases.hasOwnProperty(c.dateForSort)){
                day = d.structured_cases[c.dateForSort]
                day.confirmed += 1
                if(day.genders.hasOwnProperty(c.gender))
                    day.genders[c.gender] += 1
                else
                    day.genders[c.gender == "" ? 'Undefined' : c.gender] = 1

                if(day.ages.hasOwnProperty(c.age))
                    day.ages[c.age] += 1
                else 
                    day.ages[c.age] = 1
            }
            else{
                d.structured_cases[c.dateForSort] = {
                    dateObject: c.dateObject,
                    dateForSort: c.dateForSort,
                    confirmed: 1,
                    genders: {
                        [c.gender == "" ? 'Undefined' : c.gender]: 1
                    },
                    ages: {
                        [c.age]: 1
                    }
                }
            }
        })
    })
}


const createTimeSeries = (cases_by_district) => {
    // Now go through structured_cases and make time_series
    cases_by_district.forEach(d => {

        d.time_series = []
        let i = 0

        _.forEach(d.structured_cases, (day) => {
            if(i == 0){
                previous = day
                d.time_series.push(day)
            }
            else{
                // Merge the day with previous
                const new_day = {
                    dateObject: day.dateObject,
                    confirmed: day.confirmed + previous.confirmed,
                    genders: {},
                    ages: {}
                }
                _.forEach(day.ages, (val, key) => {
                    new_day.ages[key] = val
                })
                _.forEach(day.genders, (val, key) => {
                    new_day.genders[key] = val
                })

                _.forEach(previous.ages, (val, key) => {
                    if(new_day.ages.hasOwnProperty(key))
                        new_day.ages[key] += val
                    else 
                        new_day.ages[key] = val
                })

                _.forEach(previous.genders, (val, key) => {
                    if(new_day.genders.hasOwnProperty(key))
                        new_day.genders[key] += val
                    else 
                        new_day.genders[key] = val
                })

                let since_last = differenceInCalendarDays(parseISO(new_day.dateObject), parseISO(previous.dateObject))
                if(since_last > 0){
                    decrementable_date_object = parseISO(previous.dateObject)
                
                    for(let days_to_add = 1; days_to_add < since_last; days_to_add++){
                        additional_day = Object.assign({}, previous)
                        additional_day.dateObject = format(addDays(decrementable_date_object, days_to_add),'yyyy-MM-dd') + 'T00:00:00.000Z'

                        d.time_series.push(additional_day)
                    }
                }
                d.time_series.push(new_day)
                previous = new_day



            }

            i++
        })


    })
}


module.exports = {
    get: (output_folder) => {
        const url = 'https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-situation/covid-19-current-cases/covid-19-current-cases-details';
        axios(url).then(response => {
            const html = response.data;
            const cases = addDateTransformation(getCases(html))
            // We need to get the unique set of DHBs
            const districts = []
            
            cases.forEach(c => {
                if(!districts.includes(c.district)) districts.push (c.district)
            })
    
            const cases_by_district = []
            
            districts.forEach(name => {
                // This gets the filtered cases onto each case by district
                cases_by_district.push({
                    name: name,
                    cases: _.sortBy(
                        cases.filter(c => c.district == name ), 'dateForSort')
                })
            })
    
            createStructuredCases(cases_by_district)
    
            createTimeSeries(cases_by_district)
                    
            const nz_output = cases_by_district.map(d => ({
                name: d.name,
                highest: d.time_series[d.time_series.length - 1],
                time_series: d.time_series
            })) 

            fs.writeFile(output_folder +'/nz-advanced.json', JSON.stringify(nz_output, null, 2), function(err) {
                if(err) return console.log(err);
                console.log("NZ Advanced MOH File was saved!");
            })
            
        })
        .catch(console.error);
    }

}