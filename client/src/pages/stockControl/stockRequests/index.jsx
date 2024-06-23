import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import Header from '../../../components/Header';

import { IP_ADDRESS } from '../../../App';

const StockRequests = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: 'requestNumber', headerName: 'Request Number', flex: 0.75 },
    { field: 'reasonForRequest', headerName: 'Reason For Request', flex: 2 },
    {
      field: 'requestPriority',
      headerName: 'Request Priority',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (params.row.requestPriority === 'High') {
          return <Typography color={colors.redAccent[500]}>{params.row.requestPriority}</Typography>;
        } else if (params.row.requestPriority === 'Medium') {
          return <Typography color={colors.primary[500]}>{params.row.requestPriority}</Typography>;
        } else {
          return <Typography color={colors.greenAccent[500]}>{params.row.requestPriority}</Typography>;
        }
      },
    },
    { field: 'dateOfRequest', headerName: 'Date of Request', flex: 1 },
    { field: 'requestedBy', headerName: 'Requested By', flex: 0.75 },
    {
      field: 'requestStatus',
      headerName: 'Request Status',
      flex: 1,
      cellClassName: 'name-column--cell',
      renderCell: (params) => {
        if (params.row.requestStatus === 'Complete') {
          return <Typography color={colors.greenAccent[500]}>{params.row.requestStatus}</Typography>;
        } else if (params.row.requestStatus === 'Incomplete') {
          return <Typography color={colors.redAccent[500]}>{params.row.requestStatus}</Typography>;
        } else {
          return <Typography>{params.row.requestStatus}</Typography>;
        }
      },
    },
  ];

  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const fetechAllRowData = async () => {
      try {
        const res = await axios.get('http://' + IP_ADDRESS + ':8080/stock/requests');
        setRowData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetechAllRowData();
  }, []);

  return (
    <Box m="20px">
      <Header title="Stock Requests" subtitle="An active list of stock removal requests from the service department." />
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
        <DataGrid
          rows={rowData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          // initialState={{
          //   sorting: {
          //     sortModel: [{ field: 'id', sort: 'desc' }],
          //   },
          // }}
        />
      </Box>
    </Box>
  );
};

export default StockRequests;
