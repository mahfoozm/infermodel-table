import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTable } from "react-table";
import "./Table.css";

function Table() {
  const [data, setData] = useState([]);
  const columns = React.useMemo(
    () => [
      {
        Header: "Column 1",
        accessor: "column1",
      },
      {
        Header: "Column 2",
        accessor: "column2",
      },
      {
        Header: "Column 3",
        accessor: "column3",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("http://localhost:3001/api/myendpoint");
        setData(result.data);
      } catch (error) {
        console.error(error);
        alert("Error fetching data from server!");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    console.log("Sending data to server:", data);
    try {
      const updatedData = data.map((row) => {
        return {
          column1: row.column1,
          column2: row.column2,
          column3: row.column3,
        };
      });
      await axios.post("http://localhost:3001/api/myendpoint", {
        data: updatedData,
      });
      alert("Data successfully sent to server!");
    } catch (error) {
      alert("Error sending data to server!");
      console.error(error);
    }
  };

  const handleInputChange = (event, rowIndex, columnId) => {
    const newData = [...data];
    newData[rowIndex][columnId] = event.target.value;
    setData(newData);
  };

  const handleAddRow = () => {
    setData([...data, { column1: "", column2: "", column3: "" }]);
  };

  const handleClearTable = () => {
    setData([{ column1: "", column2: "", column3: "" }]);
  };

  return (
    <div className="container">
      <div className="table-container">
        <table {...getTableProps()}>
          {/* header */}
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {/* table body */}
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, j) => {
                    return (
                      <td key={`${i}-${j}`}>
                        <input
                          type="text"
                          value={cell.value}
                          onChange={(e) =>
                            handleInputChange(e, i, cell.column.id)
                          }
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="logo-container">
        <img src="/logo192.png" alt="Your logo" className="logo" />
      </div>
      <div className="buttons-container" style={{ clear: "both" }}>
        <button onClick={handleAddRow}>Add Row</button>
        <button onClick={handleClearTable}>Clear Table</button>
        <button onClick={handleSubmit}>Send Data</button>
      </div>
    </div>
  );
}

export default Table;
