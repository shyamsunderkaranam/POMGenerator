import React, { useState, useEffect, useMemo } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';

const ITEMS_PER_PAGE = 5;

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
    <div>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            {personas.map((persona) => (
              <th key={persona}>{persona}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayFeatures.map((feature) => (
            <tr key={feature}>
              <td>{feature}</td>
              {personas.map((persona) => (
                <td key={persona}>{data[persona].ftvalues[feature]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TabPanel = ({ value, index, children }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box p={3}>{children}</Box>}
  </div>
);

function App() {
  const [data, setData] = useState({});
  const [tier, setTier] = useState(0);
  const [env, setEnv] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    axios.get('/api/data')
      .then(response => setData(response.data))
      .catch(error => console.error("Error fetching data: ", error));
  }, []);

  const tiers = Object.keys(data);
  const environments = tiers.length > 0 ? Object.keys(data[tiers[tier]]) : [];

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="App">
      <Tabs 
        value={tier} 
        onChange={(e, newValue) => { setTier(newValue); setEnv(0); setCurrentPage(1); setSearchQuery(''); }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tiers.map((tierName, index) => (
          <Tab label={tierName} key={index} />
        ))}
      </Tabs>
      {tiers.map((tierName, tierIndex) => (
        <TabPanel value={tier} index={tierIndex} key={tierIndex}>
          <Tabs 
            value={env} 
            onChange={(e, newValue) => { setEnv(newValue); setCurrentPage(1); setSearchQuery(''); }}
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
                currentPage={currentPage - 1}
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
    </div>
  );
}

export default App;
