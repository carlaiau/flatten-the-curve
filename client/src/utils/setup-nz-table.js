const SetupNZTable  = (areas) => {

    const rows = areas.map(c => {
        const yesterday = c.time_series && c.time_series.length > 2 ? c.time_series[c.time_series.length -2]: false
        
        const total_change = yesterday ? c.highest.total - yesterday.total : 0
        const confirmed_change = yesterday ? c.highest.confirmed - yesterday.confirmed : 0
        
        const obj = {
            name: c.name,
            total: c.highest.total,
            total_change,
            confirmed: c.highest.confirmed || 0,
            confirmed_change,
            }
        
        return obj


    })

    

    const headCells = [
        { id: 'name', numeric: false, disablePadding: false, label: 'DHB', class: 'country' },
        { id: 'confirmed', numeric: true, disablePadding: false, label: 'Total', class: 'total' },
        { id: 'total_change', numeric: true, disablePadding: false, label: '24H Change', class: 'delta' },
    ]

    return { rows, headCells }

}

export default SetupNZTable