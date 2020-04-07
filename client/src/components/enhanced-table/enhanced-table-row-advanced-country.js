import React from 'react'
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { Link } from "gatsby"
const EnhancedTableRowAdvancedCountry = ({row, index, tidy, country_name}) => (
    <TableRow key={row.name}>
        <TableCell component="th" id={`enhanced-table-checkbox-${index}`} scope="row">
        {row.name}
        </TableCell>
        <TableCell>
            <strong>
                {tidy.format(row.confirmed, 2)}
            </strong>
        </TableCell>
        <TableCell>
        {tidy.format(row.confirmed_change,2) }
        </TableCell>
        <TableCell>
            <strong>
                {tidy.format(row.deaths,2)}
            </strong>
        </TableCell>
        <TableCell>
            {tidy.format(row.deaths_change)}
        </TableCell>
        {country_name == 'United States' ?
        <>
            <TableCell>
                <strong>
                    {tidy.format(row.hospitalized,2)}
                </strong>
            </TableCell>
            <TableCell>
                {tidy.format(row.hospitalized_change)}
            </TableCell>
            <TableCell>
                <strong>
                    {tidy.format(row.recovered,2)}
                </strong>
            </TableCell>
            <TableCell>
                {tidy.format(row.recovered_change)}
            </TableCell>
            <TableCell>
                <strong>
                    {tidy.format(row.tests,2)}
                </strong>
            </TableCell>
            <TableCell>
                {tidy.format(row.tests_change)}
            </TableCell>
        </>
        : <></> }
        
    </TableRow>
)
export default EnhancedTableRowAdvancedCountry