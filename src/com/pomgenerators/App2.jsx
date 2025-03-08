import React, { useState, useEffect, useMemo } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import LaunchIcon from '@mui/icons-material/Launch';
import axios from 'axios';
import './pagination.css';
import './App.css';
import { Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const ITEMS_PER_PAGE = 20;

const TabPanel = ({ value, index, children }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box p={3}>{children}</Box>}
  </div>
);

function App2() {
  const [data, setData] = useState({});
  const [tier, setTier] = useState(0);
  const [env, setEnv] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(false);
    axios.get('https://url.com')
      .then(response => {
        setData(response.data);
        setLoading(false);
        setError(false);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setLoading(false);
        setError(true);
      });
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const tiers = Object.keys(data);
  const environments = tiers.length > 0 ? Object.keys(data[tiers[tier]]) : [];

  return (
    <div className="App">
      <Box textAlign="center" py={2} bgcolor="primary.main" color="white">
        <Typography variant="h4">Feature Toggles Dashboard</Typography>
      </Box>
      {(loading) && <h3>Loading the data. Please wait....</h3>}
      {(!loading && !error && data) && 
      <>
        <Tabs centered value={tier} onChange={(e, newValue) => { setTier(newValue); setEnv(0); setCurrentPage(0); setSearchQuery(''); }}
          sx={{ "& .MuiTabs-flexContainer": { justifyContent: "center" }, "& .MuiTab-root": { fontSize: "1.2rem", fontWeight: "bold" }, "& .Mui-selected": { bgcolor: "#e0e0e0", borderRadius: "8px" } }}>
          {tiers.map((tierName, index) => (
            <Tab label={tierName} key={index} />
          ))}
        </Tabs>
        {tiers.map((tierName, tierIndex) => (
          <TabPanel value={tier} index={tierIndex} key={tierIndex}>
            <Tabs centered value={env} onChange={(e, newValue) => { setEnv(newValue); setCurrentPage(0); setSearchQuery(''); }}
              sx={{ "& .MuiTabs-flexContainer": { justifyContent: "center" }, "& .MuiTab-root": { fontSize: "1.2rem", fontWeight: "bold" }, "& .Mui-selected": { bgcolor: "#e0e0e0", borderRadius: "8px" } }}>
              {environments.map((envName, index) => (
                <Tab label={envName} key={index} />
              ))}
            </Tabs>
          </TabPanel>
        ))}
      </>}
      {error && <h3>Error fetching data. Check console for details.</h3>}
    </div>
  );
}

export default App2;
