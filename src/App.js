
import React, { useState } from 'react';
import { Container, Row, Col, Form, Table } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    cancerTypes: [],
    sideEffects: [],
    treatmentCategories: [],
    prescriptionOptions: []
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setData(jsonData);
    };

    reader.readAsBinaryString(file);
  };

  const handleFilterChange = (event, filterType) => {
    const value = event.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value ? value.split(',') : []
    }));
  };

  const applyFilters = (data) => {
    return data.filter((row) => {
      const matchesCancerTypes = filters.cancerTypes.length
        ? filters.cancerTypes.some((ct) => row['Cancer type related'].includes(ct))
        : true;
      const matchesSideEffects = filters.sideEffects.length
        ? filters.sideEffects.includes(row['Adverse Event'])
        : true;
      const matchesTreatmentCategories = filters.treatmentCategories.length
        ? filters.treatmentCategories.includes(row['AE category related'])
        : true;
      const matchesPrescriptionOptions = filters.prescriptionOptions.length
        ? filters.prescriptionOptions.includes(row['Prescription/OTC'])
        : true;

      return matchesCancerTypes && matchesSideEffects && matchesTreatmentCategories && matchesPrescriptionOptions;
    });
  };

  const filteredData = applyFilters(data);

  return (
    <Container>
      <Row className="my-3">
        <Col>
          <h1>Drugs and Their Side Effects</h1>
          <Form.Group>
            <Form.File label="Upload Excel File" onChange={handleFileUpload} />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <h4>Filters</h4>
          <Form.Group>
            <Form.Label>Cancer Types</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter comma-separated values"
              onChange={(e) => handleFilterChange(e, 'cancerTypes')}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Side Effects</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter comma-separated values"
              onChange={(e) => handleFilterChange(e, 'sideEffects')}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Treatment Categories</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter comma-separated values"
              onChange={(e) => handleFilterChange(e, 'treatmentCategories')}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Prescription/OTC</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter comma-separated values"
              onChange={(e) => handleFilterChange(e, 'prescriptionOptions')}
            />
          </Form.Group>
        </Col>
        <Col md={9}>
          <h4>Filtered Data</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                {data[0] && Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
