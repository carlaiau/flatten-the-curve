import React from 'react'
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { Link } from "gatsby"
const EnhancedTableRowIndex = ({row, index, tidy}) => {
    const linkUrl = row.name == 'World' ? '/' : '/' + row.name.toLowerCase().replace(/\s+/g, "-")
    return (
    <TableRow key={row.name}>
        <TableCell component="th" id={`enhanced-table-checkbox-${index}`} scope="row">
            <Link to={linkUrl}>
                {row.name}
            </Link>
        </TableCell>
        <TableCell>
            <Link to={linkUrl}>
                <strong>
                    {tidy.format(row.confirmed, 2)}
                </strong>
            </Link>
        </TableCell>
        <TableCell>
            <Link to={linkUrl}>
                {tidy.format(row.confirmed_change,2) }
            </Link>
        </TableCell>
        <TableCell>
            <Link to={linkUrl}>
                <strong>
                {tidy.format(row.deaths,2)}
                </strong>
            </Link>
        </TableCell>
        <TableCell>
            <Link to={linkUrl}>
                {tidy.format(row.deaths_change)}
            </Link>        
        </TableCell>
        <TableCell>
            <Link to={linkUrl}>
                <strong>
                {tidy.format(row.recovered,2)}
                </strong>
            </Link>
        </TableCell>
        <TableCell>
            <Link to={linkUrl}>
                {tidy.format(row.recovered_change)}
            </Link>        
        </TableCell>
                
        { row.name != 'World' ?
        <TableCell>
        <Link className="button is-dark is-outlined is-size-7" to={linkUrl}>
            Go
        </Link>
        </TableCell>
        : <></> }
    </TableRow>
    )
}
export default EnhancedTableRowIndex