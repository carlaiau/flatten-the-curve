import React from 'react'
const RegionalGraphToolTip = (tooltipProps)  => {

    if(! tooltipProps.hasOwnProperty('payload')) return <></>

    if(! tooltipProps.payload || tooltipProps.payload.length == 0) return <></>
    
    
    const { payload } = tooltipProps.payload[0] 
    let date = payload.dateString


    const classes = {
        "Tests": "#218c74",
        "Confirmed": "#227093",
        "Hospitalized": "#ff793f",
        "Recovered": "#2ecc71",
        "Deaths": "#ff5252",
    }
    const tidy = new Intl.NumberFormat()
        return (
            <>
                <div className={`box`} style={{padding: '3px 5px'}}>
                    <p className="is-size-7">
                        {date ? date : ''}
                    </p>
                    <table className="is-size-7">
                        <tbody>
                        { tooltipProps.payload.map((tool,i) => (
                            <tr key={i}>
                                <td style={{textAlign: 'right'}}>
                                    <strong>{tidy.format(tool.value)}</strong>
                                </td>
                                <td style={{paddingLeft: '5px'}}>
                                    <strong style={{color: classes[tool.name]}}>
                                        {tool.name}
                                    </strong>
                                </td>
                            
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </>
        )
}
export default RegionalGraphToolTip 