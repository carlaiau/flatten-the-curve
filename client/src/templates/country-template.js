
import React, { useContext } from 'react'
import CountryPage from '../components/country-page'
import {GlobalStateContext} from "../context/GlobalContextProvider"


const CountryTemplate = ({pathContext}) => {
  const stateHook = useContext(GlobalStateContext)
  return (
    <CountryPage selected_country={pathContext.country} stateHook={stateHook}/>
  )
}

export default CountryTemplate