import * as React from 'react';
import { Box, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DataTable(props) {
    const loader = props.loader;
    const rows = props.rows;
    const columns = props.columns;
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
    };

    const filteredRows = rows && rows.filter((row) =>
        columns.some((column) => {
            const value = String(row[column.field]).toLowerCase();
            console.log(column.field)
            return value.includes(search);
        })
    );
    const handleSingleProfile = async (e) => {
        const apiURI = process.env.REACT_APP_API_URL
        fetch(`${apiURI}/candidate/${e.id}`)
            .then((res) => {
                console.log(res);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                return res.json();
            })
            .then((data) => {
                navigate(`/candidate/${e.id}`, { state: { candidate: data } });
            })
            .catch((err) => console.error(err))
    }

    return (
        <>
            <Box className="w-full mb-4">
                <TextField
                    variant="outlined"
                    label="Search candidates details"
                    fullWidth
                    value={search}
                    onChange={handleSearch}
                />
            </Box>
            <Box sx={{ minHeight: '20%', height: 'auto', width: '100%' }}>
                <DataGrid style={{ paddingLeft: '.1%', minHeight: '300px' }}
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
                    className='cursor-pointer'
                />
            </Box>
        </>

    );
}

export default DataTable;