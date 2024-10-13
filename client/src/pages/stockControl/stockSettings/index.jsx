import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import Header from '../../../components/Header';
import CreateStockCategory from './modals/createStockCategory';
import CreateStockLocation from './modals/createStockLocation';
import RemoveStockCategory from './modals/removeStockCategory';
import RemoveStockLocation from './modals/removeStockLocation';
import AssignStockLocations from './modals/assignStockLocations';

import { IP_ADDRESS } from '../../../App';

const StockSettings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const categoryTableColumns = [
    { field: 'categoryName', headerName: 'Category Name', flex: 1 },
    { field: 'stockLocations', headerName: 'Stock Locations', flex: 1.5 },
  ];

  const locationTableColumns = [
    { field: 'locationName', headerName: 'Location Name', flex: 1 },
    { field: 'rowLetter', headerName: 'Row Letter', flex: 1 },
    { field: 'shelfNumber', headerName: 'Shelf Number', flex: 1, type: 'number', headerAlign: 'left', align: 'left' },
    {
      field: 'shelfPosition',
      headerName: 'Shelf Position',
      flex: 1,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
    },
  ];

  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetechAllRowData = async () => {
      try {
        const res = await axios.get('http://' + IP_ADDRESS + ':8080/stock/categories');
        setCategoryData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetechAllRowData();
  }, []);

  const [locationData, setLocationData] = useState([]);

  useEffect(() => {
    const fetechAllRowData = async () => {
      try {
        const res = await axios.get('http://' + IP_ADDRESS + ':8080/stock/locations');
        setLocationData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetechAllRowData();
  }, []);

  return (
    <Box m="20px">
      <Header
        title="Stock Control Settings"
        subtitle="A settings page for pre-defining part categories and stock locations"
      />
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
        <div style={{ width: '49%', height: '91%', float: 'left' }}>
          <h1>Part Categories</h1>
          <DataGrid rows={categoryData} columns={categoryTableColumns} />
          <CreateStockCategory />
          <RemoveStockCategory />
          <AssignStockLocations />
        </div>

        <div style={{ width: '49%', height: '91%', float: 'right' }}>
          <h1>Stock Locations</h1>
          <DataGrid rows={locationData} columns={locationTableColumns} />
          <CreateStockLocation />
          <RemoveStockLocation />
        </div>
      </Box>
    </Box>
  );
};

export default StockSettings;
