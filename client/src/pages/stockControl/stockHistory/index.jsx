import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import Header from '../../../components/Header';

import { IP_ADDRESS } from '../../../App';

const StockHistory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: 'partNumber', headerName: 'Part Number', flex: 0.75 },
    { field: 'partDescription', headerName: 'Part Description', flex: 1.5 },
    {
      field: 'changesMade',
      headerName: 'Changes Made',
      flex: 0.75,
      cellClassName: 'name-column--cell',
      renderCell: (params) => {
        if (params.row.changesMade === 'Stock Added') {
          return <Typography color={colors.greenAccent[500]}>{params.row.changesMade}</Typography>;
        } else if (params.row.changesMade === 'Stock Removed') {
          return <Typography color={colors.redAccent[500]}>{params.row.changesMade}</Typography>;
        } else {
          return <Typography>{params.row.changesMade}</Typography>;
        }
      },
    },
    { field: 'reasonForChange', headerName: 'Reason For Change', flex: 2 },
    {
      field: 'quantityChanged',
      headerName: 'Quantity Changed',
      flex: 0.75,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (params.row.quantityChanged > 0) {
          return <Typography color={colors.greenAccent[500]}>{params.row.quantityChanged}</Typography>;
        } else if (params.row.quantityChanged < 0) {
          return <Typography color={colors.redAccent[500]}>{params.row.quantityChanged}</Typography>;
        } else {
          return <Typography>{params.row.quantityChanged}</Typography>;
        }
      },
    },
    { field: 'dateOfChange', headerName: 'Date of Change', flex: 1 },
    { field: 'changedBy', headerName: 'Changed By', flex: 1 },
  ];

  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const fetechAllRowData = async () => {
      try {
        const res = await axios.get('http://' + IP_ADDRESS + ':8080/stock/history');
        setRowData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetechAllRowData();
  }, []);

  return (
    <Box m="20px">
      <Header title="Stock History" subtitle="A list of items added and removed from stock" />
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

export default StockHistory;
