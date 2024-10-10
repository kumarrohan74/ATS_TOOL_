import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { CandidateContext } from './Context';
function DataTable(props) {
    const { loader } = React.useContext(CandidateContext);
    const rows = props.rows;
    const columns = props.columns;

    return (
        <Box sx={{ minHeight: '20%', height: 'auto', width: '100%' }}>
            <DataGrid style={{ paddingLeft: '.1%', minHeight: '350px' }}
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
                loading={loader}
            />
        </Box>
    );
}


export default DataTable;