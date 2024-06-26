import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { tokens } from '../../../../theme';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { TextField, Autocomplete } from '@mui/material';

import { styled } from '@mui/material/styles';
import { orange } from '@mui/material/colors';

import { IP_ADDRESS } from '../../../../App';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
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

const RemoveStockCategory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const [formContent, setFormContent] = useState({
    categoryName: '',
  });

  const handleFormChange = (name, value) => {
    setFormContent((prev) => ({ ...prev, [name]: value }));
  };

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

  const removePartCategory = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://' + IP_ADDRESS + ':8080/stock/categories/remove', formContent);
      console.log(res.data);
      handleModalClose();
      window.location.reload(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ display: 'inline' }}>
      <StyledButton variant="contained" onClick={handleModalOpen} style={{ backgroundColor: colors.grey[600] }}>
        Remove A Category
      </StyledButton>

      {/* Remove Stock Category Modal Container */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* Remove Stock Category Modal Form */}
        <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(2, 1fr))" sx={style}>
          <div className="form">
            <h1>Remove a Part Category</h1>

            <h4>Please enter the category you would like to remove:</h4>
            <Autocomplete
              disablePortal
              name="location"
              options={truncatedCategories}
              onChange={(event, newValue) => handleFormChange('categoryName', newValue ? newValue.label : '')}
              getOptionLabel={(option) => option.label}
              value={truncatedCategories.find((option) => option.label === formContent.categoryName) || null}
              renderInput={(params) => <TextField {...params} label="Category" />}
            />

            <ModalButton variant="contained" onClick={removePartCategory}>
              Remove Category
            </ModalButton>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default RemoveStockCategory;
