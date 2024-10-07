
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

function DataTable(props) {
    const rows = props.rows;
    const columns = props.columns;
    return (
        <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid style={{ paddingLeft: '.1%' }}
                rows={rows}
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
            />
        </Box>
    );
}


export default DataTable;