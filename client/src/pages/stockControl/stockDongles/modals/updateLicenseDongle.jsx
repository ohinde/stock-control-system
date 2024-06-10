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

const UpdateLicenseDongle = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const [allocateModalOpen, setAllocateModalOpen] = React.useState(false);
  const handleAllocateModalOpen = () => setAllocateModalOpen(true);
  const handleAllocateModalClose = () => setAllocateModalOpen(false);

  const [upgradeModalOpen, setUpgradeModalOpen] = React.useState(false);
  const handleUpgradeModalOpen = () => setUpgradeModalOpen(true);
  const handleUpgradeModalClose = () => setUpgradeModalOpen(false);

  const [allocateFormContent, setAllocateFormContent] = useState({
    serialNumber: '',
    allocatedMachineSerialNumber: '',
    allocatedMachineType: '',
    allocatedCustomer : '',
  });

  const [upgradeFormContent, setUpgradeFormContent] = useState({
    serialNumber: '',
    licenseDescription: '',
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

  const handleAllocateFormChange = (name, value) => {
    setAllocateFormContent((prev) => ({ ...prev, [name]: value }));
  };
    
  const handleUpgradeFormChange = (name, value) => {
    setUpgradeFormContent((prev) => ({ ...prev, [name]: value }));
  };

  const allocateLicenseDongle = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://' + IP_ADDRESS + ':8080/machines/aoi/licenses/allocate', allocateFormContent);
      console.log(res.data);
      handleUpgradeModalClose();
      window.location.reload(false);
    } catch (err) {
      console.log(err);
    }
  };

  const upgradeLicenseDongle = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://' + IP_ADDRESS + ':8080/machines/aoi/licenses/upgrade', upgradeFormContent);
      console.log(res.data);
      handleUpgradeModalClose();
      window.location.reload(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ display: 'inline' }}>
      <StyledButton variant="contained" onClick={handleModalOpen} style={{ backgroundColor: colors.primary[500] }}>
        Update an existing license dongle
      </StyledButton>

      {/* Allocate or Upgrade Selection Menu */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="form">
            <h1>Update An Existing License Dongle</h1>
            <h4>Would you like to allocate or upgrade an existing license dongle?</h4>
            <ModalButton
              variant="contained"
              onClick={handleAllocateModalOpen}
            >
              Change Allocation Of An Existing Dongle
            </ModalButton>
            <ModalButton
              variant="contained"
              onClick={handleUpgradeModalOpen}
            >
              Upgrade An Existing Dongle
            </ModalButton>
          </div>
        </Box>
      </Modal>

      {/* Allocate an Existing License Dongle Modal Container */}
      <Modal
        open={allocateModalOpen}
        onClose={handleAllocateModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* Allocate an Existing License Dongle Form */}
        <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(2, 1fr))" sx={style}>
          <div className="form">
            <h1>Change License Dongle Allocation</h1>

            <h4>Please enter the license dongle serial number:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Serial Number"
              onChange={(e) => handleAllocateFormChange('serialNumber', e.target.value)}
              name="serialNumber"
            />
            <br />

            <h4>Please enter the serial number for the allocated machine:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Allocated Machine Serial Number"
              onChange={(e) => handleAllocateFormChange('allocatedMachineSerialNumber', e.target.value)}
              name="allocatedMachineSerialNumber"
            />
            <br />

            <h4>Please enter the type of the allocated machine:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Allocated Machine Type"
              onChange={(e) => handleAllocateFormChange('allocatedMachineType', e.target.value)}
              name="allocatedMachineType"
            />
            <br />

            <h4>Please enter the customers name for the allocated license dongle:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Allocated Customer Name"
              onChange={(e) => handleAllocateFormChange('allocatedCustomer', e.target.value)}
              name="allocatedCustomer"
            />
            <br />

            <ModalButton variant="contained" onClick={allocateLicenseDongle}>
              Allocate License Dongle
            </ModalButton>
          </div>
        </Box>
      </Modal>

      {/* Upgrade Existing License Dongle Modal Container */}
      <Modal
        open={upgradeModalOpen}
        onClose={handleUpgradeModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* Upgrade Existing License Dongle Form */}
        <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(2, 1fr))" sx={style}>
          <div className="form">
            <h1>Upgrade an Existing License Dongle</h1>

            <h4>Please enter the license dongle serial number:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Serial Number"
              onChange={(e) => handleUpgradeFormChange('serialNumber', e.target.value)}
              name="serialNumber"
            />
            <br />

            <h4>Please enter the description for the license:</h4>
            <Autocomplete
              disablePortal
              name="licenseDescription"
              options={truncatedDongleOptions}
              onChange={(event, newValue) => handleUpgradeFormChange('licenseDescription', newValue ? newValue.label : '')}
              getOptionLabel={(option) => option.label}
              value={truncatedDongleOptions.find((option) => option.label === upgradeFormContent.licenseDescription) || null}
              renderInput={(params) => <TextField {...params} label="License Description" />}
            />
            <br />

            <ModalButton variant="contained" onClick={upgradeLicenseDongle}>
              Upgrade License Dongle
            </ModalButton>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateLicenseDongle;
