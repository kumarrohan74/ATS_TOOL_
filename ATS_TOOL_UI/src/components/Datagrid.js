import * as React from 'react';
import { Box, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URI, END_POINTS, ALERTS } from './Constants';
const { CANDIDATE } = END_POINTS;

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
            return value.includes(search);
        })
    );
    const handleSingleProfile = async (e) => {
        fetch(`${API_URI}${CANDIDATE}/${e.id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`${ALERTS.HTTP_ERROR} : ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                navigate(`${CANDIDATE}/${e.id}`, { state: { candidate: data } });
            })
            .catch((err) => console.error(err))
    }
    return (
        <>
            <Box className="w-11/12 mb-4">
                <TextField
                    variant="outlined"
                    label="Search candidates details"
                    fullWidth
                    value={search}
                    onChange={handleSearch}
                />
            </Box>
            <Box className="w-11/12" sx={{ minHeight: '20%', height: 'auto' }}>
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