import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import Header from '../../../components/Header';
import CreateLicenseDongle from './modals/createLicenseDongle';
import UpdateLicenseDongle from './modals/updateLicenseDongle';
import { IP_ADDRESS } from '../../../App';

const MachineLicenseDongles = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: 'serialNumber', headerName: 'Serial Number', flex: 1 },
    { field: 'licenseDescription', headerName: 'License Description', flex: 1 },
    { field: 'allocatedMachineSerialNumber', headerName: 'Machine Serial Number', flex: 1 },
    { field: 'allocatedMachineType', headerName: 'Machine Type', flex: 1 },
    { field: 'allocatedCustomer', headerName: 'Allocated Customer', flex: 1 },
  ];

  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const fetechAllRowData = async () => {
      try {
        const res = await axios.get('http://' + IP_ADDRESS + ':8080/machines/aoi/licenses');
        setRowData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetechAllRowData();
  }, []);
  return (
    <Box m="20px">
      <Header title="Machine License Dongles" subtitle="A complete list of all current and previous license dongles" />
      <Box
        m="20px 0 0 0"
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.grey[600],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.grey[700],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.grey[600],
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid rows={rowData} columns={columns} components={{ Toolbar: GridToolbar }} />
        <div style={{ textAlign: 'end' }}>
          <CreateLicenseDongle />
          <UpdateLicenseDongle />
        </div>
      </Box>
    </Box>
  );
};

export default MachineLicenseDongles;
