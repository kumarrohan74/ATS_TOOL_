import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { CandidateContext } from './Context';

export default function Dropdown(props) {
  const { isJDChecked, applied_position, setApplied_position, positions, application_status, setApplication_status, applicant_status } = React.useContext(CandidateContext);
  const { dropdown } = props;
  const dropdownFor = dropdown === "addProfile" ? positions : applicant_status;
  const [options, setOptions] = React.useState(dropdownFor)
  const handleChange = (event) => {
    if (dropdown === "addProfile") {
      setApplied_position(event.target.value);
      return;
    }
    if (dropdown === "applicantStatus") {
      setApplication_status(event.target.value);
      return;
    }
  };
  return (
    <FormControl sx={{ minWidth: 200 }} size="small" className="mr-2" required={(dropdown === "addProfile" && !isJDChecked) ? true : false}>
      <InputLabel id="demo-select-small-label">{dropdown === "addProfile" ? "Role" : "Status"}</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={dropdown === "addProfile" ? applied_position : application_status}
        label={dropdown === "addProfile" ? "Role" : "Status"}
        onChange={handleChange}
        disabled={props.disabled}
      >
        {options.map((option, i) => <MenuItem value={option} key={i + 1}>{option}</MenuItem>)}
      </Select>
    </FormControl>
  );
}
