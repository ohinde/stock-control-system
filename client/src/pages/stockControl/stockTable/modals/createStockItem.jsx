import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Autocomplete, Box, useTheme } from '@mui/material';
import { tokens } from '../../../../theme';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';

import { styled } from '@mui/material/styles';
import { orange } from '@mui/material/colors';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IP_ADDRESS } from '../../../../App';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1200,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const StyledButton = styled(Button)(({ theme }) => ({
  color: 'white',
  backgroundColor: orange[500],
  marginTop: '1%',
  marginRight: '1%',
  paddingTop: '6px',
  paddingBottom: '6px',
  width: 'auto',
  fontSize: '0.9em',
  '&:hover': {
    backgroundColor: orange[700],
  },
}));

const ModalButton = styled(Button)(({ theme }) => ({
  color: 'white',
  backgroundColor: orange[500],
  marginTop: '20px',
  padding: '10px',
  width: '100%',
  fontSize: '1.1em',
  '&:hover': {
    backgroundColor: orange[700],
  },
}));

const createdSuccesfully = () =>
  toast.success('Stock Item Created Succesfully', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
  });

const CreateStockItem = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const [formContent, setFormContent] = useState({
    partNumber: '',
    partDescription: '',
    partCategory: '',
    partSupplier: '',
    quantity: '',
    location: '',
    updatedBy: '',
  });

  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetechAllRowData = async () => {
      try {
        const res = await axios.get('http://' + IP_ADDRESS + ':8080/stock/categories');
        setCategories(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetechAllRowData();
  }, []);

  let truncatedCategories = Object.entries(categories).map(([id, { categoryName }]) => ({
    label: categoryName,
    id: parseInt(id),
  }));

  const handleFormChange = (name, value) => {
    setFormContent((prev) => ({ ...prev, [name]: value }));

    if (name == 'partCategory') {
      refreshLocations();
    }
  };

  const refreshLocations = async (e) => {
    try {
      const res = await axios.post('http://' + IP_ADDRESS + ':8080/stock/categories/locations', formContent);
      console.log(res.data[0].stockLocations);

      const stockLocations = res.data[0].stockLocations;
      const assignedLocations = stockLocations.split(',');
      setLocations(assignedLocations);
    } catch (err) {
      console.log(err);
    }
  };

  let truncatedLocations = Object.entries(locations).map(([id, { locationName }]) => ({
    label: locationName,
    id: parseInt(id),
  }));

  const createNewStockItem = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://' + IP_ADDRESS + ':8080/stock/create', formContent);
      console.log(res.data);
      handleModalClose();
      addNewStockItemToHistory();
      createdSuccesfully();
    } catch (err) {
      console.log(err);
    }
  };

  const addNewStockItemToHistory = async (e) => {
    const stockHistoryData = {
      partNumber: formContent.partNumber,
      partDescription: formContent.partDescription,
      changesMade: 'Stock Added',
      quantityChanged: formContent.quantity,
      reasonForChange: 'Initial Stock Entry',
      changedBy: formContent.updatedBy,
    };

    try {
      const res = await axios.post('http://' + IP_ADDRESS + ':8080/stock/history/add', stockHistoryData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ display: 'inline' }}>
      <ModalButton variant="contained" onClick={handleModalOpen} style={{ backgroundColor: colors.primary[500] }}>
        Yes
      </ModalButton>

      {/* Add Stock Modal Container */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* Add Stock Modal Form */}
        <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(2, 1fr))" sx={style}>
          <div className="form">
            <h1>Create a New Stock Item</h1>

            <h4>Please enter or scan the part number:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Part Number"
              onChange={(e) => handleFormChange('partNumber', e.target.value)}
              name="partNumber"
            />
            <br />

            <h4>Please enter the name or description of the part:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Part Description"
              onChange={(e) => handleFormChange('partDescription', e.target.value)}
              name="partDescription"
            />
            <br />

            <h4>Please enter or select the category for this part:</h4>
            <Autocomplete
              disablePortal
              name="partCategory"
              options={truncatedCategories}
              onChange={(event, newValue) => handleFormChange('partCategory', newValue ? newValue.label : '')}
              getOptionLabel={(option) => option.label}
              value={truncatedCategories.find((option) => option.label === formContent.partCategory) || null}
              renderInput={(params) => <TextField {...params} label="Category" />}
            />
            <br />

            <h4>Please enter the supplier name for this part:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Supplier"
              onChange={(e) => handleFormChange('partSupplier', e.target.value)}
              name="partSupplier"
            />
            <br />

            <h4>Please enter the inital quantity being added into stock:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Inital Quantity"
              onChange={(e) => handleFormChange('quantity', e.target.value)}
              name="quantity"
            />
            <br />

            <h4>Please enter the location for where this part will be kept in stock:</h4>
            <Autocomplete
              disablePortal
              name="location"
              options={truncatedLocations}
              onChange={(event, newValue) => handleFormChange('location', newValue ? newValue.label : '')}
              getOptionLabel={(option) => option.label}
              value={truncatedLocations.find((option) => option.label === formContent.location) || null}
              renderInput={(params) => <TextField {...params} label="Location" />}
            />
            <br />

            <h4>Please enter your name:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Created By"
              onChange={(e) => handleFormChange('updatedBy', e.target.value)}
              name="updatedBy"
            />
            <br />

            <ModalButton variant="contained" onClick={createNewStockItem}>
              Create Stock Item
            </ModalButton>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateStockItem;
