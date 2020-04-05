import React from 'react'
const RegionalGraphToolTip = (tooltipProps)  => {

    if(! tooltipProps.hasOwnProperty('payload')) return <></>

    if(! tooltipProps.payload || tooltipProps.payload.length == 0) return <></>
    
    const { payload } = tooltipProps.payload[0] 
    let date = payload.dateString
    const tidy = new Intl.NumberFormat()
        
        return (
            <>
                <div className={`box`} style={{padding: '3px 5px'}}>
                    <p className="is-size-7">
                        {date ? date : ''}
                        <br/>
                        { tooltipProps.payload.map((tool,i) => (
                            <>
                                <strong>{tidy.format(tool.value)}{' '}<span style={{float: 'right', paddingLeft: '5px'}}>{tool.name}</span></strong>
                                {i == 0 ? <br/> : <></>}
                            </>
                        ))
                        }
                    </p>
                </div>
            </>
        )
}
export default RegionalGraphToolTip 