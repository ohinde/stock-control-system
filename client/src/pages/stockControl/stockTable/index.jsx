import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import Header from '../../../components/Header';
import SearchStock from './modals/searchStock';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IP_ADDRESS } from '../../../App';

const StockTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: 'partNumber', headerName: 'Part Number', flex: 0.6 },
    { field: 'partDescription', headerName: 'Part Description', flex: 1.2 },
    { field: 'partCategory', headerName: 'Category', flex: 1, cellClassName: 'name-column--cell' },
    { field: 'partSupplier', headerName: 'Supplier', flex: 0.5, type: 'number', headerAlign: 'left', align: 'left' },
    { field: 'quantity', headerName: 'Qty', flex: 0.3 },
    { field: 'location', headerName: 'Location', flex: 0.6 },
    { field: 'lastUpdated', headerName: 'Last Updated', flex: 0.6 },
    { field: 'updatedBy', headerName: 'Updated By', flex: 0.6 },
  ];

  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const fetechAllRowData = async () => {
      try {
        const res = await axios.get('http://' + IP_ADDRESS + ':8080/stock');
        setRowData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetechAllRowData();
  }, []);

  return (
    <Box m="20px">
      <Header title="Stock Table" subtitle="An overall list containing all stock items" />
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

        <SearchStock />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Box>
    </Box>
  );
};

export default StockTable;
