import React, { useContext } from 'react'
import {GlobalStateContext} from "../../context/GlobalContextProvider"
import styled from '@emotion/styled'

const GraphOptionsSideBar = ({
    type_of_area = 'country',
    areas = {},
    max_area_count = 40, 
    show_all_areas = false,
    field = 'confirmed', 
    checkedAreas = [], 
    scale, 
    accumulateFrom,
    accumulateOptions,
    growth,
    growth_options,
    
    scaleFn,    // Callback for linear / log
    caseFn,
    checkFn,    // Callback for country select or non
    clearFn,    // Callback for clearing all countries
    allFn,     // Callback for selecting all countries
    growthFn,    // Callback for changing Growth
    maxCountFn
}) => {
    const {cumulative_confirmed, cumulative_deaths} = useContext(GlobalStateContext)
    
    const limit = show_all_areas ? 1000 : max_area_count
    
    let areas_avaliable = []
    if(type_of_area == 'country'){
        areas_avaliable = (
            field == 'confirmed' ? 
                cumulative_confirmed[accumulateFrom].filter(c => c) : 
                cumulative_deaths[accumulateFrom].filter( c => c ) 
            )
            .slice(0, limit)
    }
    else if(type_of_area == 'state'){
        areas_avaliable = (
            field == 'confirmed' ? 
                areas.confirmed[accumulateFrom].filter(c => c).filter(c => c.name != 'AK') : 
                areas.deaths[accumulateFrom].filter( c => c ).filter(c => c.name != 'AK') 
            )
            .slice(0, limit)
    }
    else{
        areas_avaliable = {}
    }


    const SideBar = styled('div')`
        .field{
            width: 100%;
        }
        .label{
            padding-top: 7px;
            padding-right: 10px;
        }
        .check-container{
            
            .checkbox{
                padding: 0 7px 7px 0;
                input{
                    margin-left: 5px;
                }
            }
        }   
    `
    return (
        <SideBar>
            <div className="field">
                <label className="label">Vertical Scale</label>
                <div className="control">
                    <div className="select">
                    <select value={scale} onChange={scaleFn}>
                        <option value='linear'>Linear</option>
                        <option value='log'>Log</option>
                    </select>
                    </div>
                </div>
            </div>
            <div className="field ">
                <label className="label">{field == 'confirmed'? 'Cases': 'Deaths'} to accumulate from</label>
                <div className="control">
                    <div className="select">
                    <select value={accumulateFrom} onChange={caseFn}>
                        { accumulateOptions.map(option => <option value={option}>{option}</option>) }
                    </select>
                    </div>
                </div>
            </div>
            <div className="field ">
                <label className="label">{field == 'confirmed' ? 'Case' : 'Death'} {growth.label.includes('%') ? 'daily growth' :'doubling rate'}</label>
                <div className="control">
                    <div className="select">
                    <select value={growth.value} onChange={growthFn}>
                        { growth_options.map(option => <option value={option.value}>{option.label}</option>) }
                    </select>
                    </div>
                </div>
            </div>
            <div className="field">
                <label className="label">
                    {type_of_area == 'country' ? 
                
                        show_all_areas ? 'All' : `Top ${max_area_count}`  + ' Countries'
                        :
                        'States'
                    }
                </label>

                <div className="check-container">
                    {areas_avaliable.map(c => (
                        <label className="checkbox" key={c.name}>
                            <input 
                                type="checkbox" name={c.name} 
                                value={c.name} defaultChecked={checkedAreas.includes(c.name)} 
                                onChange={checkFn}
                            />
                                {c.name}
                        </label>
                    ))}
                </div>
            </div>
            <div className="columns">
                <div className="column" style={{textAlign:'left'}}>
                    {type_of_area == 'country' ? 
                        <button 
                            className="button is-info has-text-white" style={{marginTop: '10px', marginRight: '10px'}} 
                            onClick={maxCountFn}
                        >
                            <strong>{show_all_areas ? `List top ${max_area_count}` : 'List All'}</strong>    
                        </button>
                    : <></>
                    }
                    <button 
                        className="button is-info has-text-white" style={{marginTop: '10px'}} 
                        onClick={() => allFn(areas_avaliable)}
                    >
                        <strong>Choose All</strong>    
                    </button>
                
                    <button className="button has-background-newt has-text-white" style={{marginTop: '10px'}} onClick={clearFn}>
                    <strong>Clear All</strong>    
                    </button>
                </div>
            </div>
            
            

    </SideBar>)
}
export default GraphOptionsSideBar
