
import React, { useContext } from 'react'
import CountryPage from '../components/country-page'
import Layout from "../components/layout"
import {GlobalStateContext} from "../context/GlobalContextProvider"


const CountryTemplate = ({pageContext}) => {
  const stateHook = useContext(GlobalStateContext)
  return (
    <Layout selected_country={pageContext.country}>
      <CountryPage selected_country={pageContext.country} stateHook={stateHook}/>
    </Layout>
  )
}

export default CountryTemplate