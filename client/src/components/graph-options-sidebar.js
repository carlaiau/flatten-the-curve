import React, { useContext } from 'react'
import {GlobalStateContext} from "../context/GlobalContextProvider"
import styled from '@emotion/styled'

const GraphOptionsSideBar = ({
    max_count = 40, 
    field = 'confirmed', 
    checkCountries = [], 
    scale, 
    min_cases,
    min_case_options,
    growth,
    growth_options,
    
    scaleFn,    // Callback for linear / log
    caseFn,
    checkFn,    // Callback for country select or non
    clearFn,    // Callback for clearing all countries
    allFn,     // Callback for selecting all countries
    growthFn    // Callback for changing Growth
}) => {
    const {cumulative_confirmed, cumulative_deaths} = useContext(GlobalStateContext)
    
    const countries_avaliable = (
        field == 'confirmed' ? 
            cumulative_confirmed[min_cases].filter(c => c) : 
            cumulative_deaths[min_cases].filter( c => c ) 
        ).slice(0,max_count)
    
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
                    <select value={min_cases} onChange={caseFn}>
                        { min_case_options.map(option => <option value={option}>{option}</option>) }
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
                <label className="label">Countries</label>
                <div className="check-container">
                    {countries_avaliable.map(c => (
                        <label className="checkbox" key={c.name}>
                            <input 
                                type="checkbox" name={c.name} 
                                value={c.name} defaultChecked={checkCountries.includes(c.name)} 
                                onChange={checkFn}
                            />
                                {c.name}
                        </label>
                    ))}
                </div>
            </div>
            <div className="columns">
                <div className="column" style={{textAlign:'left'}}>
                    <button 
                        className="button is-info has-text-white" style={{marginTop: '10px'}} 
                        onClick={() => allFn(countries_avaliable)}
                    >
                        <strong>Choose All</strong>    
                    </button>
                </div>
                <div className="column" style={{textAlign:'right'}}>
                    <button className="button has-background-newt has-text-white" style={{marginTop: '10px'}} onClick={clearFn}>
                    <strong>Clear All</strong>    
                    </button>
                </div>
            </div>
            
            

    </SideBar>)
}
export default GraphOptionsSideBar
