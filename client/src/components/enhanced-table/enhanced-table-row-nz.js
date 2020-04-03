import React from 'react'
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
const EnhancedTableRowNZ = ({row, index, tidy, selected, selectFn}) => (
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
                {tidy.format(row.total, 2)}
            </strong>
        </TableCell>
        <TableCell>
            <strong>
                {tidy.format(row.total_change,2) }
            </strong>
        </TableCell>
        
        <TableCell>
            <button className="button is-dark is-outlined is-size-7" data-val={row.name}>
                Select
            </button>
        </TableCell>
    </TableRow>
)
export default EnhancedTableRowNZ