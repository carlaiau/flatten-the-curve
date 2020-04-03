import React, { useContext } from 'react'
import {GlobalStateContext} from "../../context/GlobalContextProvider"
import styled from '@emotion/styled'

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

import SetupIndexTable from '../../utils/setup-index-table'
import EnhancedTableRowNZ from './enhanced-table-row-nz';


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



const EnhancedTable = ({rows = [], headCells = [], tidy = new Intl.NumberFormat(), pageTemplate = 'home', country_name, selected, selectFn}) => {
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


  const StyledTable = styled('div')`
      .MuiTableHead-root{
          background: #fff;
          .MuiTableCell-alignRight{
              text-align: right;
          }
      }
      .MuiTablePagination-root{
          background: #227093;
          max-width: 500px;
          border-radius: 6px;
          color: #fff;
          margin-top: 20px;
      }
      td.MuiTableCell-body{
          text-align: right;
      }
      .MuiTableBody-root{
          .MuiTableRow-root{
              &:last-of-type{
                  td, th{
                      border-bottom: none;
                  }
              }
          }
      }

      .is-selected{
          background: #333;
      }

      .MuiSelect-icon{
          color: #fff;
      }
      .MuiSvgIcon-root{
          color: #fff;
      }
      .Mui-disabled{
          .MuiSvgIcon-root{
              opacity: 0.5;
          }
      }
      .has-background-success{
        td,th{
          color: #fff;
          strong{
            color: #fff;
          }
          .button{
            opacity: 0;
          }
        }
      }
      .regional-selectable{
        &:hover{
          cursor: pointer;
          .button{
            transition: 0.5s;
            background-color: #363636;
            border-color: #363636;
            color: #fff;
          }
        }
      }

      @media screen and (max-width: 1216px){
          .MuiTableCell-root{
              padding: 10px;
          }
          .MuiTableHead-root{
              .MuiTableCell-root{
                  padding: 5px;
              }
          }
      }
      @media screen and (max-width: 920px){
          .MuiTableCell-root{
              padding: 10px 0;
          }
          .MuiTableCell-root{
              &.population{
                  display: none;
              }
          }
      }
      @media screen and (max-width: 375px){
          .MuiTableHead-root{
              .MuiTableCell-root{
                  padding: 5px;
                  line-height: 1.3;
                  font-size: 9px;
              }
              .MuiTableSortLabel-icon{
                  font-size: 12px;
              }
          }
          .MuiTableBody-root{
              .MuiTableCell-root{
                  font-size: 9px;
                  padding: 5px 0;
                  
              }
              th{
                  &.MuiTableCell-root{
                      padding-left: 5px;
                  }
              }
              .button{
                  font-size: 8px !important;
                  padding: 2px;
                  margin-left: 2px;
              }
          }
          .MuiTablePagination-root{
              width: 90%;
              margin-left: 20px;
              .MuiToolbar-root{
                  .MuiTypography-body2{
                      font-size: 9px;
                  }
              }
          }
      }
  `
  return (
    <StyledTable className="container">
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
                    return <EnhancedTableRowIndex row={row} index={index} tidy={tidy} key={index}/>
                  }
                  if(pageTemplate == 'advanced-country'){
                    return <EnhancedTableRowAdvancedCountry country_name={country_name} row={row} index={index} tidy={tidy} key={index}/>
                  }
                  if(pageTemplate == 'nz'){
                    return <EnhancedTableRowNZ row={row} index={index} tidy={tidy} key={index} selected={selected} selectFn={selectFn}/>
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
    </StyledTable>
  )
}

export default EnhancedTable