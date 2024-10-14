import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

export default function Dropdown() {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Status
        </InputLabel>
        <NativeSelect
          defaultValue={'None'}
          inputProps={{
            name: 'Status',
            id: 'uncontrolled-native',
          }}
        >
          <option value={'Selected'}>Selected</option>
          <option value={'Rejected'}>Rejected</option>
          <option value={'Pending'}>Pending</option>
        </NativeSelect>
      </FormControl>
    </Box>
  );
}
