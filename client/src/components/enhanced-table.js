import React, { useContext } from 'react'
import {GlobalStateContext} from "../context/GlobalContextProvider"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { Link } from "gatsby"


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
  const { order, orderBy, onRequestSort } = props;

  const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Country', class: 'country' },
    { id: 'population', numeric: true, disablePadding: false, label: 'Population', class: 'population' },
    { id: 'confirmed', numeric: true, disablePadding: false, label: 'Confirmed', class: 'confirmed' },
    { id: 'confirmed_change', numeric: true, disablePadding: false, label: '24H Change', class: 'delta' },
    //{ id: 'confirmed_per_mil', numeric: true, disablePadding: false, label: 'Per Mil', class: 'per_mil' },
    { id: 'deaths', numeric: true, disablePadding: false, label: 'Deaths', class: 'deaths' },
    { id: 'deaths_change', numeric: true, disablePadding: false, label: '24H Change', class: 'delta' },
    //{ id: 'deaths_per_mil', numeric: true, disablePadding: false, label: 'Per Mil', class: 'per_mil' },
    
    { id: 'recovered', numeric: true, disablePadding: false, label: 'Recovered', class: 'recovered' },
    { id: 'recovered_change', numeric: true, disablePadding: false, label: '24H Change', class: 'recovered_delta' },
    {id: 'link'}
    //{ id: 'recovered_per_mil', numeric: true, disablePadding: false, label: 'Per Mil',class: 'per_mil' },
  ];



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



const EnhancedTable = ({tidy}) => {
  const {countries} = useContext(GlobalStateContext)

  const world = {
      name: 'World',
      population: 0,
      confirmed: 0,
      confirmed_change: 0,
      deaths: 0,
      deaths_change: 0,
      recovered: 0,
      recovered_change: 0
  }
  const rows = countries.map(c => {
    const yesterday = c.time_series && c.time_series.length > 2 ? c.time_series[c.time_series.length -2]: false
    
    const confirmed_change = yesterday ? c.highest_confirmed - yesterday.confirmed : 0
    const deaths_change = yesterday ? c.highest_deaths != 0 ? c.highest_deaths - yesterday.deaths: 0 : 0
    const recovered_change = yesterday ? c.highest_recovered - yesterday.recovered : 0
    
    world.confirmed += c.highest_confirmed    
    world.deaths += c.highest_deaths || 0
    world.recovered += c.highest_recovered || 0

    world.confirmed_change += confirmed_change 
    world.deaths_change += deaths_change
    world.recovered_change += recovered_change

    world.population += c.population
    

    return {
      name: c.country_name,
      population: c.population,
      confirmed: c.highest_confirmed,
      confirmed_change,
      //confirmed_per_mil: (c.highest_confirmed / (c.population / 1000000)),
      deaths: c.highest_deaths || 0,
      deaths_change,
      //deaths_per_mil: (c.highest_deaths / (c.population / 1000000)),
      recovered: c.highest_recovered || 0,
      recovered_change
      //recovered_per_mil: (c.highest_recovered / (c.population / 1000000)),
    }
  })

  rows.push(world)

  
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
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow key={row.name}>
                      <TableCell component="th" id={labelId} scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell>
                        {tidy.format(row.population,2) }
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
                      <TableCell><strong>{tidy.format(row.recovered,2)}</strong></TableCell>
                      <TableCell>{tidy.format(row.recovered_change,2)}</TableCell>
                      { row.name != 'World' ?
                      <TableCell>
                        <Link className="button is-dark is-outlined is-size-7" to={'/' + row.name.toLowerCase().replace(/\s+/g, "-")}>
                          Details
                        </Link>
                      </TableCell>
                      : <></> }
                    </TableRow>
                  );
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