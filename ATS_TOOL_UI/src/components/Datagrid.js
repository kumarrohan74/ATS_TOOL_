import * as React from 'react';
import { Box, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { CandidateContext } from './Context';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DataTable(props) {
  const { loader } = React.useContext(CandidateContext);
  const rows = props.rows;
  const columns = props.columns;
  const navigate = useNavigate();
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

  async function handleSingleProfile(e) {
    const apiURI = process.env.REACT_APP_API_URL
    console.log(e.id)
    fetch(`${apiURI}/candidate/${e.id}`)
      .then((res) => {
        console.log(res);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        navigate(`/candidate/${e.id}`, { state: data });
      })
      .catch((err) => console.error(err))
  }
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <TextField
          variant="outlined"
          label="Search"
          fullWidth
          value={search}
          onChange={handleSearch}
        />
      </Box>
      <Box sx={{ minHeight: '20%', height: 'auto', width: '100%' }}>
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
          onRowClick={handleSingleProfile}
        />
      </Box>
    </>

  );
}


export default DataTable;