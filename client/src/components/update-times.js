import React, { useContext } from 'react'
import {GlobalStateContext} from "../context/GlobalContextProvider"
import styled from '@emotion/styled'
const UpdateTimes = ({color}) => {
    const {update_times} = useContext(GlobalStateContext)


    const Times = styled('div')`
        p{
            ${color == 'white' ? 'color: #fff;': ''}
            strong{
                ${color == 'white' ? 'color: #fff;': ''}
            }
        }
        margin-bottom: 10px;
    `
    return (
        <Times>
            <p className="is-size-7">
              Global data updated at <strong>{update_times.global}</strong>
            </p>
            <p className="is-size-7">
              United States data updated at <strong>{update_times.us}</strong>
            </p>
            <p className="is-size-7">
              New Zealand data updated at <strong>{update_times.nz}</strong>
            </p>
        </Times>
    )
}

export default UpdateTimes