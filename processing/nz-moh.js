const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs')
const _ = require('lodash')
const { parse, format } = require('date-fns')
const differenceInCalendarDays = require('date-fns/differenceInCalendarDays')

const url = 'https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-situation/covid-19-current-cases/covid-19-current-cases-details';
axios(url).then(response => {
    const html = response.data;
    const $ = cheerio.load(html);


    const cases = addDateTransformation(getCases(html))


    // We need to get the unique set of DHBs
    const districts = []
    
    cases.forEach(c => {
        if(!districts.includes(c.district)) districts.push (c.district)
    })

    

    // Foreach DHB name create a new Oject
    // filter for all cases that have this dhb 

    const cases_by_district = []
    
    districts.forEach(name => {
        // This gets the filtered cases onto each case by district
        cases_by_district.push({
            name: name,
            cases: _.sortBy(
                cases.filter(c => c.district == name ), 'dateForSort')
        })


        //structured_cases = 

        /*
        [
            {
            "date": "2020-02-24T00:00:00.000Z",
            "confirmed": 1,
            "deaths": 0,
            "confirmed_per_mil": 0.026901689872692054
            },
            {
            "date": "2020-02-25T00:00:00.000Z",
            "confirmed": 1,
            "deaths": 0,
            "confirmed_per_mil": 0.026901689872692054
            },
        ]

        */
    })

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


    // Now go through structured_cases and make time_series
    cases_by_district.forEach(d => {

        d.time_series = []
        let is_first = true
        _.forEach(d.structured_cases, (day) => {
            if(is_first){
                previous = day
                d.time_series.push(day)
                is_first = false
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
                d.time_series.push(new_day)
                previous = new_day

            }
        })


    })


    





    







    fs.writeFile('nz-output/test.json', JSON.stringify(cases, null, 2), function(err) {
        if(err) return console.log(err);
        console.log("NZ test file was saved!");
    }); 

    fs.writeFile('nz-output/cases_by_dhb.json', JSON.stringify(cases_by_district, null, 2), function(err) {
        if(err) return console.log(err);
        console.log("NZ test file was saved!");
    }); 
    
})
.catch(console.error);





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