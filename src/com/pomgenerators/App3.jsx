import React from 'react';

import React from 'react';

const Table = ({ data, showModal }) => {
  const excludeFields = ['fieldToExclude1', 'fieldToExclude2'];

  const filteredData = data.map(item => {
    const filteredItem = { ...item };
    excludeFields.forEach(field => delete filteredItem[field]);
    return filteredItem;
  });

  return (
    <table>
      <thead>
        <tr>
          {Object.keys(filteredData[0]).map((key, index) => (
            <th key={index}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} onClick={() => showModal(item)}>
            {Object.values(filteredData[index]).map((value, index) => (
              <td key={index}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;


************************
import React, { useState } from 'react';
import Table from './Table';
import Modal from './Modal';
import data from './data.json'; // Replace with your JSON data

const App = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const showModal = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div>
      <Table data={data} showModal={showModal} />
      {selectedItem && <Modal item={selectedItem} closeModal={closeModal} />}
    </div>
  );
};

export default App;


***************
const Modal = ({ item, closeModal }) => {
  const excludeFields = ['fieldToExclude1', 'fieldToExclude2'];

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>Item Details</h2>
        <table>
          <tbody>
            {Object.keys(item).map((key) => (
              !excludeFields.includes(key) && (
                <tr key={key}>
                  <td><strong>{key}</strong></td>
                  <td>{item[key]}</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Modal;

*********
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

**********************************
  table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f2f2f2;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

tr:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}

th {
  background-color: #4CAF50;
  color: white;
}
**********************
