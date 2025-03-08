import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, Tab, Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Button, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import axios from 'axios';
import './pagination.css';
import './App.css';

const ITEMS_PER_PAGE = 20;

const EnvironmentTable = ({ data, searchQuery, currentPage, setPageCount, personaFilter }) => {
  const [personas, setPersonas] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const personasList = Object.keys(data);
    const featuresList = Object.keys(data[personasList[0]].ftvalues);
    setPersonas(personasList);
    setFeatures(featuresList);
  }, [data]);

  const filteredFeatures = useMemo(() => 
    features.filter(feature => 
      feature.toLowerCase().includes(searchQuery.toLowerCase())
    ), [features, searchQuery]);

  useEffect(() => {
    setPageCount(Math.ceil(filteredFeatures.length / ITEMS_PER_PAGE));
  }, [filteredFeatures, setPageCount]);

  const displayFeatures = useMemo(() => 
    filteredFeatures.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE), 
    [filteredFeatures, currentPage]);

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell><Typography>Feature Toggle Name</Typography></TableCell>
            {personas.filter(persona => !personaFilter || persona === personaFilter).map((persona) => (
              <TableCell key={persona}><Typography>{persona}</Typography></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {displayFeatures.map((feature) => (
            <TableRow key={feature}>
              <TableCell><Typography>{feature}</Typography></TableCell>
              {personas.filter(persona => !personaFilter || persona === personaFilter).map((persona) => (
                <TableCell key={persona}>
                  <Button href={data[persona]?.url+"."+feature} target="_blank" variant="contained" endIcon={<LaunchIcon />}>
                    {data[persona]?.ftvalues[feature] ?? "Not Applicable"}
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function App2() {
  const [data, setData] = useState({});
  const [tier, setTier] = useState(0);
  const [env, setEnv] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [personaFilter, setPersonaFilter] = useState('');
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
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  const handlePageChange = (_, value) => setCurrentPage(value);
  const tiers = Object.keys(data);
  const environments = tiers.length > 0 ? Object.keys(data[tiers[tier]]) : [];
  const personas = tiers.length > 0 && environments.length > 0 ? Object.keys(data[tiers[tier]][environments[env]]) : [];

  return (
    <div className="App">
      <Box textAlign="center" p={2} bgcolor="primary.main" color="white" borderRadius={2}>
        <Typography variant="h4">Feature Toggle Dashboard</Typography>
      </Box>

      {loading && <Typography align="center" variant="h6">Loading the data. Please wait....</Typography>}
      {error && <Typography align="center" variant="h6" color="error">Error loading data.</Typography>}
      
      {!loading && !error && (
        <>
          <Box display="flex" justifyContent="center" mt={2}>
            <Tabs value={tier} onChange={(e, newValue) => { setTier(newValue); setEnv(0); setCurrentPage(0); setSearchQuery(''); }}>
              {tiers.map((tierName, index) => <Tab key={index} label={tierName} sx={{ fontWeight: tier === index ? 'bold' : 'normal' }} />)}
            </Tabs>
          </Box>
          
          <Box display="flex" justifyContent="center" mt={2}>
            <Tabs value={env} onChange={(e, newValue) => { setEnv(newValue); setCurrentPage(0); setSearchQuery(''); }}>
              {environments.map((envName, index) => <Tab key={index} label={envName} sx={{ fontWeight: env === index ? 'bold' : 'normal' }} />)}
            </Tabs>
          </Box>

          <Box display="flex" alignItems="center" gap={2} p={2}>
            <TextField label="Search" variant="outlined" fullWidth value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <FormControl>
              <InputLabel>Persona</InputLabel>
              <Select value={personaFilter} onChange={(e) => setPersonaFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {personas.map(persona => <MenuItem key={persona} value={persona}>{persona}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          <EnvironmentTable data={data[tiers[tier]][environments[env]]} searchQuery={searchQuery} currentPage={currentPage} setPageCount={setPageCount} personaFilter={personaFilter} />
          
          <Pagination count={pageCount} page={currentPage} onChange={handlePageChange} color="primary" showFirstButton showLastButton />
        </>
      )}
    </div>
  );
}

export default App2;
