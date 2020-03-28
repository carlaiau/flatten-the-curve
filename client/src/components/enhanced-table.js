import React, { useContext } from 'react'
import {GlobalStateContext} from "../context/GlobalContextProvider"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';

import TableSortLabel from '@material-ui/core/TableSortLabel';

import EnhancedTableRowIndex from './enhanced-table-row-index'
import EnhancedTableRowAdvancedCountry from './enhanced-table-row-advanced-country'

import SetupIndexTable from '../utils/setup-index-table'

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  
  return 0;
}

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}



const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort, headCells } = props;

  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell key={headCell.id}  align={headCell.numeric ? 'right' : 'left'}     
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            className={headCell.class || ''}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}



const EnhancedTable = ({rows = [], headCells = [], tidy = new Intl.NumberFormat(), pageTemplate = 'home'}) => {
  const {countries} = useContext(GlobalStateContext)


  if(pageTemplate == 'home'){
    const indexSetup = SetupIndexTable(countries)  
    rows = indexSetup.rows
    headCells = indexSetup.headCells
  }
  

  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('confirmed');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  return (
    <div>
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead className="box"
              order={order} orderBy={orderBy}
              onRequestSort={(event, property) => {
                const isAsc = orderBy === property && order === 'desc';
                setOrder(isAsc ? 'asc' : 'desc');
                setOrderBy(property);
              }}
              rowCount={rows.length}
              headCells={headCells}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  if(pageTemplate == 'home'){
                    console.log("WHYYYYY")
                    return <EnhancedTableRowIndex row={row} index={index} tidy={tidy} key={index}/>
                  }
                  if(pageTemplate == 'advanced-country'){
                    console.log("This should ne fring")
                    return <EnhancedTableRowAdvancedCountry row={row} index={index} tidy={tidy} key={index}/>
                  }
                })}

            </TableBody>
          </Table>
        </TableContainer>
        <div className="columns" style={{justifyContent: 'flex-end', marginTop: '10px'}}>
            <TablePagination
              rowsPerPageOptions={[10, 20, 50]}
              component="div"
              
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={(event, newPage) => {
                setPage(newPage);
              }}
              onChangeRowsPerPage={event => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0)
              }}
            />
          
        </div>
    </div>
  )
}

export default EnhancedTable