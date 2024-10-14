import * as React from 'react';
import { Box, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { CandidateContext } from './Context';
import { useState } from 'react';
function DataTable(props) {
  const { loader } = React.useContext(CandidateContext);
  const rows = props.rows;
  const columns = props.columns;
  const [search, setSearch] = useState('');
  {/* Handle search change */ }
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
  };
  {/* Filter rows based on the search term applied across all columns */ }
  const filteredRows = rows && rows.filter((row) =>
    columns.some((column) => {
      const value = String(row[column.field]).toLowerCase();
      console.log(column.field)
      return value.includes(search);
    })
  );
  return (<>
    {/* Search bar to input search */}
    <Box sx={{ width: '100%' }}>
      <TextField
        variant="outlined"
        label="Search"
        fullWidth
        value={search}
        onChange={handleSearch}
      />
    </Box>
    <Box sx={{ minHeight: '20%', height: 'auto', width: '100%' }} className="mt-4">
      <DataGrid style={{ paddingLeft: '.1%', minHeight: '350px' }}
        rows={filteredRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        // checkboxSelection
        disableRowSelectionOnClick
        loading={loader}
      />
    </Box>
  </>
  );
}


export default DataTable;