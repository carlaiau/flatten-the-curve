import React from 'react'
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { Link } from "gatsby"
const EnhancedTableRowIndex = ({row, index, tidy}) => (
    <TableRow key={row.name}>
        <TableCell component="th" id={`enhanced-table-checkbox-${index}`} scope="row">
        {row.name}
        </TableCell>
        <TableCell>
        {typeof row.population != 'undefined' ? tidy.format(row.population,2) : '' }
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
            {tidy.format(row.deaths_change)}</TableCell>
        { row.name != 'World' ?
        <TableCell>
        <Link className="button is-dark is-outlined is-size-7" to={'/' + row.name.toLowerCase().replace(/\s+/g, "-")}>
            Details
        </Link>
        </TableCell>
        : <></> }
    </TableRow>
)
export default EnhancedTableRowIndex