// Node Module Imports
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { tokens } from '../../theme';
import { Box, Typography, useTheme } from '@mui/material';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';

// MUI Icon Import
import KeyIcon from '@mui/icons-material/Key';
import HistoryIcon from '@mui/icons-material/History';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState('Dashboard');

  return (
    <Box
      sx={{
        '& .pro-sidebar-inner': {
          background: `${colors.grey[900]} !important`,
        },
        '& .pro-icon-wrapper': {
          backgroundColor: 'transparent !important',
        },
        '& .pro-inner-item': {
          padding: '5px 35px 5px 20px !important',
        },
        '& .pro-inner-item:hover': {
          color: '#ef7629 !important',
        },
        '& .pro-menu-item.active': {
          color: '#ef7629 !important',
        },
      }}
    >
      <ProSidebar collapsed={false}>
        <Menu iconShape="square">
          <MenuItem
            style={{
              margin: '10px 0 20px 0',
              color: colors.grey[100],
            }}
          >
            {
              <Box display="flex" justifyContent="center" alignItems="center" ml="15px">
                <Typography variant="h3" color={colors.grey[100]} fontSize="1.7rem">
                  Stock Control
                </Typography>
              </Box>
            }
          </MenuItem>

          {
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user-profile.png`}
                  style={{
                    cursor: 'pointer',
                    borderRadius: '50%',
                  }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{
                    m: '10px 0 0 0',
                  }}
                >
                  User Name
                </Typography>
                <Typography variant="h5" color={colors.primary[500]}>
                  User Role
                </Typography>
              </Box>
            </Box>
          }

          {/* Menu Items */}
          <Box paddingLeft={'10%'}>
            <Item title="Dashboard" to="/" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{
                m: '15px 0 5px 20px',
              }}
            >
              Stock Control
            </Typography>
            <Item
              title="Stock Table"
              to="/stock/table"
              icon={<InventoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Stock Dongles"
              to="/stock/dongles"
              icon={<KeyIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Stock Requests"
              to="/stock/requests"
              icon={<PublishedWithChangesIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Stock History"
              to="/stock/history"
              icon={<HistoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Stock Settings"
              to="/stock/settings"
              icon={<CategoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

export default Sidebar;
