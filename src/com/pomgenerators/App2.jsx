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
import { Typography } from '@mui/material';

const ITEMS_PER_PAGE = 20;

const EnvironmentTable = ({ data, searchQuery, currentPage, setPageCount }) => {
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
    <Table stickyHeader aria-label="sticky table">
      <TableHead >
        <TableRow className="table-header">
          <TableCell>
            <Typography>Feature Toggle Name</Typography>
            </TableCell>
          {personas.map((persona) => (
            <TableCell key={persona}>
              <Typography>{persona}</Typography>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {displayFeatures.map((feature) => (
          <TableRow key={feature}>
            <TableCell>
            <Typography>{feature}</Typography>
            </TableCell>
            {personas.map((persona) => (
              <TableCell key={persona}>
                {/* <a className="ftvalue" href={data[persona]?.url+"."+feature} target="_blank" > */}
                <Button href={data[persona]?.url+"."+feature}  target="_blank" variant="contained" endIcon={<LaunchIcon />}>
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
        console.log(response.data);
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
        <h2> Feature Toggles Dashboard</h2>
        {(loading)&& <h3>Loading the data. Please wait....</h3> }
      {(!loading && !error && data) && 
      <>
      <Tabs value={tier} 
        onChange={(e, newValue) => { setTier(newValue); setEnv(0); setCurrentPage(0); setSearchQuery(''); }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tiers.map((tierName, index) => (
          <Tab label={tierName} key={index} />
        ))}
      </Tabs>
      {tiers.map((tierName, tierIndex) => (
        <TabPanel value={tier} index={tierIndex} key={tierIndex}>
          <Tabs value={env} 
            onChange={(e, newValue) => { setEnv(newValue); setCurrentPage(0); setSearchQuery(''); }}
            variant="scrollable"
            scrollButtons="auto"
            >
            {environments.map((envName, index) => (
              <Tab label={envName} key={index} />
            ))}
          </Tabs>
          {environments.map((envName, envIndex) => (
            <TabPanel value={env} index={envIndex} key={envIndex}>
              <TextField 
                label="Search" 
                variant="outlined" 
                fullWidth 
                margin="normal" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <EnvironmentTable 
                data={data[tierName][envName]} 
                searchQuery={searchQuery}
                currentPage={currentPage}
                setPageCount={setPageCount}
              />
              
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton

              />
            </TabPanel>
          ))}
        </TabPanel>
      ))}
      </>}
      {(error)&& <h3>Error while getting the data. Check browsers console for more info..... </h3> }
    </div>
  );
}

export default App2;
