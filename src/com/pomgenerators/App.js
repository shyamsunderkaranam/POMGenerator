import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ReactPaginate from 'react-paginate';

const jsonData = {
  "tier1": {
    "dev1": {
      "persona1": { "url": "http://localhost:3000", "ftvalues": { "ft1": "value1", "ft2": "value2", "ft3": "value3", "ft4":"val4" } },
      "persona2": { "url": "http://localhost:3000", "ftvalues": { "ft1": "value1", "ft2": "value2", "ft3": "value3" } }
    },
    "dev2": {
      "persona1": { "url": "http://localhost:3000", "ftvalues": { "ft1": "value1", "ft2": "value2", "ft3": "value3" } },
      "persona2": { "url": "http://localhost:3000", "ftvalues": { "ft1": "value1", "ft2": "value2", "ft3": "value3" } }
    }
  },
  "tier2": {
    "qa1": {
      "persona1": { "url": "http://localhost:3000", "ftvalues": { "ft1": "value100", "ft2": "value2", "ft3": "value3" } },
      "persona2": { "url": "http://localhost:3000", "ftvalues": { "ft1": "value1", "ft2": "value200", "ft3": "value3" } }
    },
    "qa2": {
      "persona1": { "url": "http://localhost:3000", "ftvalues": { "ft1": "value1", "ft2": "value2", "ft3": "value3" } },
      "persona2": { "url": "http://localhost:3000", "ftvalues": { "ft1": "value1", "ft2": "value2", "ft3": "value3", "ft5":"val5" } }
    }
  },
  "tier3": {
    "prod1": {
      "persona1": { "url": "http://localhost:3000", "ftvalues": { "ft1": "value1", "ft2": "value2", "ft3": "value3" } },
      "persona2": { "url": "http://localhost:3000", "ftvalues": { "ft1": "value1", "ft2": "value2", "ft3": "value3" } }
    },
    "prod2": {
      "persona1": { "url": "http://localhost:3000", 
        "ftvalues": { "ft1": "value1", "ft2": "value2", "ft3": "value300",
          "ft4": "value1", "ft5": "value2", "ft6": "value300",
          "ft7": "value1", "ft8": "value5", "ft9": "value900"
         } 
      },
      "persona2": { "url": "http://localhost:3000", 
        "ftvalues": { "ft1": "value100", "ft2": "value200", "ft3": "value3" } }
    }
  }
};
const ITEMS_PER_PAGE = 5;
const EnvironmentTable = ({ data, env,features,searchQuery, currentPage, setPageCount  }) => {
  const personas = Object.keys(data);
  //const features = Object.keys(data[personas[0]].ftvalues);

  const filteredPersonas = personas.filter(persona => 
    persona.toLowerCase().includes(searchQuery.toLowerCase())
  );

  setPageCount(Math.ceil(filteredPersonas.length / ITEMS_PER_PAGE));
  
  const displayPersonas = 
  filteredPersonas.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  

  return (
    <>
    <h1>{env}</h1>
    <table>
      <thead>
        <tr>
          <th>Persona</th>
          {displayPersonas.map((persona) => (
            <th key={persona}>{persona}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {features.map((feature) => (
          <tr key={feature}>
            <td>{feature}</td>
            {displayPersonas.map((persona) => (
              <td key={persona}>{(data[persona].ftvalues[feature])??"Not Applicable"}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
};

const TabPanel = ({ value, index, children }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box p={3}>{children}</Box>}
  </div>
);

function App() {
  const [tier, setTier] = useState(0);
  const [env, setEnv] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const tiers = Object.keys(jsonData);
  const environments = tiers.length > 0 ? Object.keys(jsonData[tiers[tier]]) : [];
  const uniqueFeatures = uniqFeatures(jsonData);

  return (
    <div className="App">
      <Tabs value={tier} onChange={(e, newValue) => { setTier(newValue); setEnv(0); }}>
        {tiers.map((tierName, index) => (
          <Tab label={tierName} key={index} />
        ))}
      </Tabs>
      {tiers.map((tierName, tierIndex) => (
        <TabPanel value={tier} index={tierIndex} key={tierIndex}>
          <Tabs value={env} onChange={(e, newValue) => setEnv(newValue)}>
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
              data={jsonData[tierName][envName]} 
              env={envName} 
              features={uniqueFeatures} 
              searchQuery={searchQuery}
              currentPage={currentPage}
              setPageCount={setPageCount}/>
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

const uniqFeatures = (jsonData) => {
  const features = new Set();
  for (const tier in jsonData) {
    for (const env in jsonData[tier]) {
      for (const persona in jsonData[tier][env]) {
        for (const feature in jsonData[tier][env][persona].ftvalues) {
          features.add(feature);
        }
      }
    }
  }
  return Array.from(features);
}

export default App;
