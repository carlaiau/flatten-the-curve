const SetupIndexTable  = (countries) => {

    const world = {
        name: 'World',
        population: 0,
        confirmed: 0,
        confirmed_change: 0,
        deaths: 0,
        deaths_change: 0,
    recovered: 0,
    recovered_change: 0
}
    const rows = countries.map(c => {
        const yesterday = c.time_series && c.time_series.length > 2 ? c.time_series[c.time_series.length -2]: false
        
        const confirmed_change = yesterday ? c.highest_confirmed - yesterday.confirmed : 0
        const deaths_change = yesterday ? c.highest_deaths != 0 ? c.highest_deaths - yesterday.deaths: 0 : 0
        const recovered_change = yesterday ? c.highest_recovered - yesterday.recovered : 0
        
        world.confirmed += c.highest_confirmed    
        world.deaths += c.highest_deaths || 0
        world.recovered += c.highest_recovered || 0

        world.confirmed_change += confirmed_change 
        world.deaths_change += deaths_change
        world.recovered_change += recovered_change

        return {
            name: c.name,
            confirmed: c.highest_confirmed,
            confirmed_change,
            //confirmed_per_mil: (c.highest_confirmed / (c.population / 1000000)),
            deaths: c.highest_deaths || 0,
            deaths_change,
            recovered: c.highest_recovered,
            recovered_change: recovered_change
            //deaths_per_mil: (c.highest_deaths / (c.population / 1000000)),

        }
    })

    rows.push(world)

    const headCells = [
        { id: 'name', numeric: false, disablePadding: false, label: 'Country', class: 'country' },
        { id: 'confirmed', numeric: true, disablePadding: false, label: 'Confirmed', class: 'confirmed' },
        { id: 'confirmed_change', numeric: true, disablePadding: false, label: '24H Change', class: 'delta' },
        { id: 'deaths', numeric: true, disablePadding: false, label: 'Deaths', class: 'deaths' },
        { id: 'deaths_change', numeric: true, disablePadding: false, label: '24H Change', class: 'delta' },
        { id: 'recovered', numeric: true, disablePadding: false, label: 'Recovered', class: 'recovered' },
        { id: 'recovered_change', numeric: true, disablePadding: false, label: '24H Change', class: 'delta' },
        {id: 'link'}
        
    ]

    return { rows, headCells }

}

export default SetupIndexTable