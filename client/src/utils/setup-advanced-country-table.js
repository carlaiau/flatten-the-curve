const SetupAdvancedCountryTable  = (areas) => {


    const rows = areas.map(c => {
    const yesterday = c.time_series && c.time_series.length > 2 ? c.time_series[c.time_series.length -2]: false
    
    const confirmed_change = yesterday ? c.highest_confirmed - yesterday.confirmed : 0
    const deaths_change = yesterday ? c.highest_deaths != 0 ? c.highest_deaths - yesterday.deaths: 0 : 0
    
    const hospitalized_change = yesterday && c.highest_hospitalized && yesterday.hospitalized ? c.highest_hospitalized - yesterday.hospitalized : 0

    const tests_change = yesterday && c.highest_tests ? c.highest_tests - yesterday.tests : 0
    

    return {
        name: c.name,
        population: c.population,
        confirmed: c.highest_confirmed,
        confirmed_change,
        
        deaths: c.highest_deaths || 0,
        deaths_change,

        hospitalized: c.highest_hospitalized,
        hospitalized_change,

        tests: c.highest_tests,
        tests_change

        }
    })

    

    const headCells = [
        { id: 'name', numeric: false, disablePadding: false, label: 'State', class: 'country' },
        { id: 'confirmed', numeric: true, disablePadding: false, label: 'Confirmed', class: 'confirmed' },
        { id: 'confirmed_change', numeric: true, disablePadding: false, label: '24H Change', class: 'delta' },
        { id: 'deaths', numeric: true, disablePadding: false, label: 'Deaths', class: 'deaths' },
        { id: 'deaths_change', numeric: true, disablePadding: false, label: '24H Change', class: 'delta' },
        { id: 'hospitalized', numeric: true, disablePadding: false, label: 'Hospitalized', class: 'hospitalized' },
        { id: 'hospitalized_change', numeric: true, disablePadding: false, label: '24H Change', class: 'delta' },
        { id: 'tests', numeric: true, disablePadding: false, label: 'Tests', class: 'tests' },
        { id: 'tests_change', numeric: true, disablePadding: false, label: '24H Change', class: 'delta' },
    ]

    return { rows, headCells }

}

export default SetupAdvancedCountryTable