import React, { useState, useEffect, useMemo } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ReactPaginate from 'react-paginate';
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
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    axios.get('/api/data')
      .then(response => setData(response.data))
      .catch(error => console.error("Error fetching data: ", error));
  }, []);

  const tiers = Object.keys(data);
  const environments = tiers.length > 0 ? Object.keys(data[tiers[tier]]) : [];

  return (
    <div className="App">
      <Tabs value={tier} onChange={(e, newValue) => { setTier(newValue); setEnv(0); setCurrentPage(0); setSearchQuery(''); }}>
        {tiers.map((tierName, index) => (
          <Tab label={tierName} key={index} />
        ))}
      </Tabs>
      {tiers.map((tierName, tierIndex) => (
        <TabPanel value={tier} index={tierIndex} key={tierIndex}>
          <Tabs value={env} onChange={(e, newValue) => { setEnv(newValue); setCurrentPage(0); setSearchQuery(''); }}>
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
              <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={(data) => setCurrentPage(data.selected)}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            </TabPanel>
          ))}
        </TabPanel>
      ))}
    </div>
  );
}

export default App;
