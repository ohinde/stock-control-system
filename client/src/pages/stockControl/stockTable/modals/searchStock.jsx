import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Autocomplete, Typography, Box, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../../../theme';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';

import { styled } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import CreateStockItem from './createStockItem';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import EditIcon from '@mui/icons-material/Edit';

import { IP_ADDRESS } from '../../../../App';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const widerStyle = {
  ...style,
  width: '45%',
};

const largeStyle = {
  ...style,
  width: '55%',
  height: '75%',
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

const updatedSuccesfully = () =>
  toast.success('Stock Item Updated Succesfully', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
  });

const SearchStock = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Default Search Modal Handling
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  // Search Result Modal Handling
  const [resultsModalOpen, setResultsModalOpen] = React.useState(false);
  const handleResultsModalOpen = () => setResultsModalOpen(true);
  const handleResultsModalClose = () => setResultsModalOpen(false);

  // Add Stock Modal Handling
  const [addStockModalOpen, setAddStockModalOpen] = React.useState(false);
  const handleAddStockModalOpen = () => {
    setAddStockModalOpen(true);
    partData.forEach((item) => {
      setStockChangeFormContent((prevContent) => ({
        ...prevContent,
        changesMade: 'Stock Added',
        partNumber: item.partNumber,
        partDescription: item.partDescription,
      }));
    });
  };
  const handleAddStockModalClose = () => setAddStockModalOpen(false);

  // Remove Stock Modal Handling
  const [removeStockModalOpen, setRemoveStockModalOpen] = React.useState(false);
  const handleRemoveStockModalOpen = () => {
    setRemoveStockModalOpen(true);
    partData.forEach((item) => {
      setStockChangeFormContent((prevContent) => ({
        ...prevContent,
        changesMade: 'Stock Removed',
        partNumber: item.partNumber,
        partDescription: item.partDescription,
      }));
    });
  };
  const handleRemoveStockModalClose = () => setRemoveStockModalOpen(false);

  // Edit Part Description Modal Handling
  const [partDescriptionModalOpen, setPartDescriptionModalOpen] = React.useState(false);
  const handlePartDescriptionModalOpen = () => setPartDescriptionModalOpen(true);
  const handlePartDescriptionModalClose = () => setPartDescriptionModalOpen(false);

  // Edit Part Category Modal Handling
  const [partCategoryModalOpen, setCategoryModalOpen] = React.useState(false);
  const handlePartCategoryModalOpen = () => setCategoryModalOpen(true);
  const handlePartCategoryModalClose = () => setCategoryModalOpen(false);

  // Edit Part Location Modal Handling
  const [partLocationModalOpen, setPartLocationModalOpen] = React.useState(false);
  const handlePartLocationModalOpen = () => setPartLocationModalOpen(true);
  const handlePartLocationModalClose = () => setPartLocationModalOpen(false);

  // Edit Additional Notes Modal Handling
  const [additionalNotesModalOpen, setAdditionalNotesModalOpen] = React.useState(false);
  const handleAdditionalNotesModalOpen = () => setAdditionalNotesModalOpen(true);
  const handleAdditionalNotesModalClose = () => setAdditionalNotesModalOpen(false);

  // Part Not Found Modal Handling
  const [partNotFoundModalOpen, setPartNotFoundModalOpen] = React.useState(false);
  const handlePartNotFoundModalOpen = () => setPartNotFoundModalOpen(true);
  const handlePartNotFoundModalClose = () => setPartNotFoundModalOpen(false);

  // Defines Search Form Content
  const [searchFormContent, setSearchFormContent] = useState({
    partDescription: '',
    partNumber: '',
  });

  // Handle Search Form Changes
  const handleSearchFormChange = (name, value) => {
    setSearchFormContent((prev) => {
      const updatedFormContent = { ...prev, [name]: value };
      return updatedFormContent;
    });
  };

  // Defines Stock Change Form Content
  const [stockChangeFormContent, setStockChangeFormContent] = useState({
    partNumber: '',
    partDescription: '',
    changesMade: '',
    quantityChanged: '',
    reasonForChange: '',
    changedBy: '',
    additionalNotes: '',
  });

  // Load All Available Part Descriptions From The Database
  const [partDescriptions, setPartDescriptions] = useState([]);

  useEffect(() => {
    const fetechAllRowData = async () => {
      try {
        const res = await axios.get('http://' + IP_ADDRESS + ':8080/stock/partdescriptions');
        setPartDescriptions(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetechAllRowData();
  }, []);

  // Format The Available Part Descriptions From The Database
  let truncatedPartDescriptions = Object.entries(partDescriptions).map(([id, { partDescription }]) => ({
    label: partDescription,
    id: parseInt(id),
  }));

  // Load All Available Part Numbers From The Database
  const [partNumbers, setPartNumbers] = useState([]);

  useEffect(() => {
    const fetechAllRowData = async () => {
      try {
        const res = await axios.get('http://' + IP_ADDRESS + ':8080/stock/partnumbers');
        setPartNumbers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetechAllRowData();
  }, []);

  // Format The Available Part Numbers From The Database
  let truncatedPartNumbers = Object.entries(partNumbers).map(([id, { partNumber }]) => ({
    label: partNumber,
    id: parseInt(id),
  }));

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

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetechAllRowData = async () => {
      try {
        const res = await axios.get('http://' + IP_ADDRESS + ':8080/stock/locations');
        setLocations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetechAllRowData();
  }, []);

  let truncatedLocations = Object.entries(locations).map(([id, { locationName }]) => ({
    label: locationName,
    id: parseInt(id),
  }));

  // Handle The Search Function And Load Part Information
  const [partData, setPartData] = useState([]);

  const handleSearch = async (e) => {
    try {
      if (searchFormContent.partDescription !== '') {
        const res = await axios.get('http://' + IP_ADDRESS + ':8080/stock/search/description', {
          params: searchFormContent,
        });

        if (res.data.length > 0) {
          setPartData(res.data);
          handlePartHistorySearch();
        } else {
          handleModalClose();
          handlePartNotFoundModalOpen();
          console.log('No results found.');
        }
      } else {
        const res = await axios.get('http://' + IP_ADDRESS + ':8080/stock/search/partnumber', {
          params: searchFormContent,
        });

        if (res.data.length > 0) {
          setPartData(res.data);
          handlePartHistorySearch();
        } else {
          handleModalClose();
          handlePartNotFoundModalOpen();
          console.log('No results found.');
        }
      }

      console.log(searchFormContent);
    } catch (err) {
      console.log(err);
    }
  };

  // Load Part History Information
  const [historyData, setHistoryData] = useState([]);

  const handlePartHistorySearch = async (e) => {
    try {
      const res = await axios.get('http://' + IP_ADDRESS + ':8080/stock/history/part', {
        params: searchFormContent,
      });
      setHistoryData(res.data);
      handleModalClose();
      handleResultsModalOpen();
    } catch (err) {
      console.log(err);
    }
  };

  // Define Part History Table Columns
  const columns = [
    {
      field: 'changesMade',
      headerName: 'Changes Made',
      flex: 0.6,
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
    { field: 'quantityChanged', headerName: 'Quantity Changed', flex: 0.6 },
    { field: 'reasonForChange', headerName: 'Reason For Change', flex: 1.5, cellClassName: 'name-column--cell' },
    {
      field: 'dateOfChange',
      headerName: 'Date Of Change',
      flex: 0.5,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
    },
    { field: 'changedBy', headerName: 'Changed By', flex: 0.6 },
  ];

  // Render Loaded Part Data
  const renderPartData = () => {
    return partData.map((item) => (
      <div key={item.id}>
        <div style={{ display: 'inline-block', width: '40%' }}>
          <h2 style={{ display: 'inline-block', marginRight: '2%' }}> Part Description: {item.partDescription}</h2>{' '}
          <EditIcon
            onClick={() => {
              handlePartDescriptionModalOpen();
            }}
          />
          <br />
          <p style={{ display: 'inline-block', marginTop: '1%', marginRight: '2%' }}>Part Number: {item.partNumber}</p>
          <br />
          <p style={{ display: 'inline-block', marginTop: '1%', marginRight: '2%' }}>Category: {item.partCategory}</p>
          <EditIcon
            onClick={() => {
              handlePartCategoryModalOpen();
            }}
          />
          <br />
          <p style={{ display: 'inline-block', marginTop: '1%', marginRight: '2%' }}>Quantity: {item.quantity}</p>
          <br />
          <p style={{ display: 'inline-block', marginTop: '1%', marginRight: '2%' }}>Location: {item.location}</p>
          <EditIcon
            onClick={() => {
              handlePartLocationModalOpen();
            }}
          />
          <br />
          <p style={{ display: 'inline-block', marginTop: '1%', marginRight: '2%' }}>
            Last Updated: {item.lastUpdated}
          </p>
          <br />
          <p style={{ display: 'inline-block', marginTop: '1%', marginRight: '2%' }}>Updated By: {item.updatedBy}</p>
        </div>
        <div style={{ display: 'inline-block', verticalAlign: 'top', textAlign: 'right', width: '60%' }} iv>
          <EditIcon
            onClick={() => {
              handleAdditionalNotesModalOpen();
            }}
          />
          <h2 style={{ display: 'inline', marginLeft: '2%' }}>Additional Notes</h2>
          <p>{item.additionalNotes}</p>
        </div>
      </div>
    ));
  };

  // Handle Stock Change Form Changes
  const handleStockChangeFormChange = (name, value) => {
    setStockChangeFormContent((prev) => {
      const updatedFormContent = { ...prev, [name]: value };
      return updatedFormContent;
    });
  };

  // Add Stock Changes To Stock History
  const submitStockChangesToHistory = async () => {
    try {
      const res = await axios.post('http://' + IP_ADDRESS + ':8080/stock/history/add', stockChangeFormContent);
    } catch (err) {
      console.log(err);
    }

    updateStockQuantities();
  };

  // Update Stock Levels In The Main Stock Table
  const updateStockQuantities = async () => {
    const dataToUpdate = partData.map((item) => ({
      partNumber: item.partNumber,
      quantity: parseInt(item.quantity, 10) + parseInt(stockChangeFormContent.quantityChanged, 10),
      updatedBy: stockChangeFormContent.changedBy,
    }));

    handleAddStockModalClose();
    handleRemoveStockModalClose();

    try {
      const res = await axios.post('http://' + IP_ADDRESS + ':8080/stock/update/quantity', dataToUpdate);
      updatedSuccesfully();
    } catch (err) {
      console.log(err);
    }

    handleSearch();
  };

  // Update Part Description
  const updatePartDescription = async () => {
    const dataToUpdate = partData.map((item) => ({
      partNumber: item.partNumber,
      partDescription: stockChangeFormContent.partDescription,
    }));

    handlePartDescriptionModalClose();

    try {
      const res = await axios.post('http://' + IP_ADDRESS + ':8080/stock/update/description', dataToUpdate);
      updatedSuccesfully();
    } catch (err) {
      console.log(err);
    }

    handleResultsModalClose();
  };

  // Update Part Category
  const updatePartCategory = async () => {
    const dataToUpdate = partData.map((item) => ({
      partNumber: item.partNumber,
      partCategory: stockChangeFormContent.partCategory,
    }));

    handlePartCategoryModalClose();

    try {
      const res = await axios.post('http://' + IP_ADDRESS + ':8080/stock/update/category', dataToUpdate);
      updatedSuccesfully();
    } catch (err) {
      console.log(err);
    }

    handleSearch();
  };

  // Update Part Location
  const updatePartLocation = async () => {
    const dataToUpdate = partData.map((item) => ({
      partNumber: item.partNumber,
      location: stockChangeFormContent.location,
    }));

    handlePartLocationModalClose();

    try {
      const res = await axios.post('http://' + IP_ADDRESS + ':8080/stock/update/location', dataToUpdate);
      updatedSuccesfully();
    } catch (err) {
      console.log(err);
    }

    handleSearch();
  };

  // Update Additional Notes
  const updateAdditionalNotes = async () => {
    const dataToUpdate = partData.map((item) => ({
      partNumber: item.partNumber,
      additionalNotes: stockChangeFormContent.additionalNotes,
    }));

    handleAdditionalNotesModalClose();

    try {
      const res = await axios.post('http://' + IP_ADDRESS + ':8080/stock/update/notes', dataToUpdate);
      updatedSuccesfully();
    } catch (err) {
      console.log(err);
    }

    handleSearch();
  };

  return (
    <div style={{ display: 'inline' }}>
      <StyledButton
        variant="contained"
        onClick={() => {
          handleModalOpen();
          handleSearchFormChange('partNumber', '');
        }}
        style={{ backgroundColor: colors.primary[500] }}
      >
        Search Stock
      </StyledButton>

      {/* Search Stock Modal Container */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* Search Stock Modal Form */}
        <Box sx={style}>
          <div className="form">
            <h1>Search for a stock item</h1>
            <h4>Please search for a part using the description or scan the part number:</h4>

            <Autocomplete
              disablePortal
              freeSolo
              name="partDescription"
              options={truncatedPartDescriptions}
              onChange={(event, newValue) => handleSearchFormChange('partDescription', newValue ? newValue.label : '')}
              getOptionLabel={(option) => option.label}
              value={
                truncatedPartDescriptions.find((option) => option.label === searchFormContent.partDescription) || null
              }
              renderInput={(params) => <TextField {...params} label="Part Description" />}
            />
            <br />

            <TextField
              fullWidth
              variant="outlined"
              label="Part Number"
              onChange={(e) => handleSearchFormChange('partNumber', e.target.value)}
              name="partNumber"
            />
            <br />

            <ModalButton variant="contained" onClick={handleSearch}>
              Search
            </ModalButton>
          </div>
        </Box>
      </Modal>

      {/* Search Results Modal Container */}
      <Modal
        open={resultsModalOpen}
        onClose={handleResultsModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* Search Results Modal */}
        <Box sx={largeStyle}>
          {/* Display part data */}
          {partData.length > 0 && (
            <Box
              m="20px 0 0 0"
              height="45%"
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
              <h1>Search Results</h1>
              {renderPartData()}
              <br />
              <h2>Part History</h2>
              <DataGrid rows={historyData} columns={columns} hideFooter={true} />
              <div style={{ display: 'inline-block', width: '100%' }}>
                <StyledButton
                  variant="contained"
                  style={{ backgroundColor: colors.primary[500], marginTop: '20px' }}
                  onClick={handleAddStockModalOpen}
                >
                  Add To Stock
                </StyledButton>

                <StyledButton
                  variant="contained"
                  style={{ backgroundColor: colors.primary[500], marginTop: '20px' }}
                  onClick={handleRemoveStockModalOpen}
                >
                  Remove From Stock
                </StyledButton>
              </div>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Add Stock Modal Container */}
      <Modal
        open={addStockModalOpen}
        onClose={handleAddStockModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="form">
            <h1>Add Item To Stock</h1>

            <h4>Please enter the amount of the item you are adding:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Quantity to be added"
              onChange={(e) => handleStockChangeFormChange('quantityChanged', e.target.value)}
              name="quantityChanged"
            />
            <br />
            <br />

            <h4>Please confirm the reason for adding this into stock</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Reason for adding"
              onChange={(e) => handleStockChangeFormChange('reasonForChange', e.target.value)}
              name="reasonForChange"
            />
            <br />
            <br />

            <h4>Please enter the name of who added this</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Added by"
              onChange={(e) => handleStockChangeFormChange('changedBy', e.target.value)}
              name="changedBy"
            />
            <br />
            <br />

            <ModalButton variant="contained" onClick={submitStockChangesToHistory}>
              Submit
            </ModalButton>
          </div>
        </Box>
      </Modal>

      {/* Remove Stock Modal Container */}
      <Modal
        open={removeStockModalOpen}
        onClose={handleRemoveStockModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="form">
            <h1>Remove Item From Stock</h1>

            <h4>Please enter the amount of the item you are removing:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Quantity to be removed"
              onChange={(e) => handleStockChangeFormChange('quantityChanged', -e.target.value)}
              name="quantityChanged"
            />
            <br />
            <br />

            <h4>Please confirm the reason for removal from stock</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Reason for removal"
              onChange={(e) => handleStockChangeFormChange('reasonForChange', e.target.value)}
              name="reasonForChange"
            />
            <br />
            <br />

            <h4>Please enter the name of who removed this</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Removed by"
              onChange={(e) => handleStockChangeFormChange('changedBy', e.target.value)}
              name="changedBy"
            />
            <br />
            <br />

            <ModalButton variant="contained" onClick={submitStockChangesToHistory}>
              Submit
            </ModalButton>
          </div>
        </Box>
      </Modal>

      {/* Edit Part Description Modal Container */}
      <Modal
        open={partDescriptionModalOpen}
        onClose={handlePartDescriptionModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={widerStyle}>
          <div className="form">
            <h1>Edit Part Description</h1>

            <h4>Please enter the new part description you would like to add below:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Part Description"
              onChange={(e) => handleStockChangeFormChange('partDescription', e.target.value)}
              name="partDescription"
            />
            <br />
            <br />

            <ModalButton variant="contained" onClick={updatePartDescription}>
              Submit
            </ModalButton>
          </div>
        </Box>
      </Modal>

      {/* Edit Part Category Modal Container */}
      <Modal
        open={partCategoryModalOpen}
        onClose={handlePartCategoryModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={widerStyle}>
          <div className="form">
            <h1>Edit Part Category</h1>

            <h4>Please select the new part category you would like to add below:</h4>

            <Autocomplete
              disablePortal
              name="partCategory"
              options={truncatedCategories}
              onChange={(event, newValue) =>
                handleStockChangeFormChange('partCategory', newValue ? newValue.label : '')
              }
              getOptionLabel={(option) => option.label}
              value={truncatedCategories.find((option) => option.label === stockChangeFormContent.partCategory) || null}
              renderInput={(params) => <TextField {...params} label="Category" />}
            />
            <br />
            <br />

            <ModalButton variant="contained" onClick={updatePartCategory}>
              Submit
            </ModalButton>
          </div>
        </Box>
      </Modal>

      {/* Edit Part Description Modal Container */}
      <Modal
        open={partLocationModalOpen}
        onClose={handlePartLocationModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={widerStyle}>
          <div className="form">
            <h1>Edit Part Location</h1>

            <h4>Please select the new part location you would like to add below:</h4>

            <Autocomplete
              disablePortal
              name="location"
              options={truncatedLocations}
              onChange={(event, newValue) => handleStockChangeFormChange('location', newValue ? newValue.label : '')}
              getOptionLabel={(option) => option.label}
              value={truncatedLocations.find((option) => option.label === stockChangeFormContent.location) || null}
              renderInput={(params) => <TextField {...params} label="Location" />}
            />
            <br />
            <br />

            <ModalButton variant="contained" onClick={updatePartLocation}>
              Submit
            </ModalButton>
          </div>
        </Box>
      </Modal>

      {/* Edit Additional Notes Modal Container */}
      <Modal
        open={additionalNotesModalOpen}
        onClose={handleAdditionalNotesModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={widerStyle}>
          <div className="form">
            <h1>Edit Additional Notes</h1>

            <h4>Please enter the additional notes you would like to add below:</h4>
            <TextField
              fullWidth
              variant="outlined"
              label="Additional Notes"
              onChange={(e) => handleStockChangeFormChange('additionalNotes', e.target.value)}
              name="additionalNotes"
            />
            <br />
            <br />

            <ModalButton variant="contained" onClick={updateAdditionalNotes}>
              Submit
            </ModalButton>
          </div>
        </Box>
      </Modal>

      {/* Part Not Found Modal Container */}
      <Modal
        open={partNotFoundModalOpen}
        onClose={handlePartNotFoundModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="form">
            <h1>Part Not Found</h1>
            <h4>Would you like to create a new part?</h4>

            <CreateStockItem />
            <ModalButton variant="contained" onClick={handlePartNotFoundModalClose}>
              No
            </ModalButton>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default SearchStock;
