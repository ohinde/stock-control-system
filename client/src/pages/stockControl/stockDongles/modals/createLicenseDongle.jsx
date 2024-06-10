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
import { IP_ADDRESS } from '../../../../App';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 750,
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

const CreateLicenseDongle = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const [formContent, setFormContent] = useState({
    serialNumber: '',
    licenseDescription: '',
    allocatedMachineSerialNumber: '',
    allocatedMachineType: '',
    allocatedCustomer: '',
  });

  const [dongleOptions, setDongleOptions] = useState([]);

  useEffect(() => {
    const fetechAllRowData = async () => {
      try {
        const res = await axios.get('http://' + IP_ADDRESS + ':8080/machines/aoi/licenses/options');
        setDongleOptions(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetechAllRowData();
  }, []);

  let truncatedDongleOptions = Object.entries(dongleOptions).map(([id, { licenseDescription }]) => ({
    label: licenseDescription,
    id: parseInt(id),
  }));

  const handleFormChange = (name, value) => {
    setFormContent((prev) => ({ ...prev, [name]: value }));
    console.log(formContent);
  };

  const createNewLicenseDongle = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://' + IP_ADDRESS + ':8080/machines/aoi/licenses/create', formContent);
      console.log(res.data);
      handleModalClose();
      window.location.reload(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ display: 'inline' }}>
      <StyledButton variant="contained" onClick={handleModalOpen} style={{ backgroundColor: colors.primary[500] }}>
        Create a new machine license dongle
      </StyledButton>

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
            <h1>Create a New License Dongle</h1>

            <h4>Please enter the license dongle serial number:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Serial Number"
              onChange={(e) => handleFormChange('serialNumber', e.target.value)}
              name="serialNumber"
            />
            <br />

            <h4>Please enter the description for the license:</h4>
            <Autocomplete
              disablePortal
              name="licenseDescription"
              options={truncatedDongleOptions}
              onChange={(event, newValue) => handleFormChange('licenseDescription', newValue ? newValue.label : '')}
              getOptionLabel={(option) => option.label}
              value={truncatedDongleOptions.find((option) => option.label === formContent.licenseDescription) || null}
              renderInput={(params) => <TextField {...params} label="License Description" />}
            />
            <br />

            <h4>If already allocated, please enter the serial number of the allocated machine:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Machine Serial Number"
              onChange={(e) => handleFormChange('allocatedMachineSerialNumber', e.target.value)}
              name="allocatedMachineSerialNumber"
            />
            <br />

            <h4>If already allocated, please enter the type of the allocated machine:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Machine Variant"
              onChange={(e) => handleFormChange('allocatedMachineType', e.target.value)}
              name="allocatedMachineType"
            />
            <br />

            <h4>If already allocated, please enter the customers name:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Customer Name"
              onChange={(e) => handleFormChange('allocatedCustomer', e.target.value)}
              name="allocatedCustomer"
            />
            <br />

            <ModalButton variant="contained" onClick={createNewLicenseDongle}>
              Create License Dongle
            </ModalButton>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateLicenseDongle;
