import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { CandidateContext } from './Context';
import { useNavigate } from 'react-router-dom';
function DataTable(props) {
    const { loader } = React.useContext(CandidateContext);
    const rows = props.rows;
    const columns = props.columns;
    const navigate= useNavigate();
    
   async function handleSingleProfile(e){
    const apiURI = process.env.REACT_APP_API_URL
    console.log(e.id)
       fetch(`${apiURI}/candidate/${e.id}`)
       .then((res)=>{
        console.log(res);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          return res.json();
        })
       .then((data)=> {
        navigate(`/candidate/${e.id}`,{state: data});
       })
       .catch((err)=> console.error(err))
    }
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
                onRowClick={handleSingleProfile}
            />
        </Box>
    );
}


export default DataTable;