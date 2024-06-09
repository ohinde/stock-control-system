// Node Module Imports
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';

// Dashboard Page and Global Components
import Dashboard from './pages/dashboard';
import Topbar from './pages/global/Topbar';
import Sidebar from './pages/global/Sidebar';

// Stock Control Pages
import StockTable from './pages/stockControl/stockTable';
import StockHistory from './pages/stockControl/stockHistory';
import StockSettings from './pages/stockControl/stockSettings';

export const IP_ADDRESS = 'localhost';

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />

              {/* Stock Control Pages*/}
              {<Route path="/stock/table" element={<StockTable />} />}
              {<Route path="/stock/history" element={<StockHistory />} />}
              {<Route path="/stock/settings" element={<StockSettings />} />}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
