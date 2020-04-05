import React from 'react'
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
const EnhancedTableRowSelectableSummary = ({row, index, tidy, selected, selectFn}) => (
    <TableRow 
        key={row.name} 
        className={"regional-selectable " + (selected == row.name ? 'has-background-success': '')}
        onClick={() => {selectFn(row.name)}}
    >
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
    </TableRow>
)
export default EnhancedTableRowSelectableSummary