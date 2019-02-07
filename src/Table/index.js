import React from 'react';
import TableCell from './TableCell';
import './Table.css';

export default function Table({
  columns,
  sort,
  rows,
  cellHeights,
  activeColHeader,
  sortAscending,
  tableRef
}) {
  const renderColumnHeadingRow = (cell, cellIndex) => {
    const sortType = () => {
      if (
        typeof rows[0][cellIndex] === 'object' &&
        rows[0][cellIndex].hasOwnProperty('sortBy')
      ) {
        return 'indexObjectComparator';
      } else if (
        isNaN(rows[0][cellIndex]) &&
        !isNaN(Date.parse(rows[0][cellIndex]))
      ) {
        //sometimes BirthYear is "Unknown" :(
        return 'indexDateComparator';
      } else if (!isNaN(parseInt(rows[0][cellIndex]))) {
        return 'indexNumComparator';
      } else {
        return 'indexStringComparator';
      }
    };

    return (
      <TableCell
        key={`heading-${cellIndex}`}
        content={columns[cellIndex]}
        header={true}
        active={activeColHeader === columns[cellIndex]}
        fixed={cellIndex === 0}
        height={cellHeights[0]}
        sort={sort}
        sortAscending={sortAscending}
        cellIndex={cellIndex}
        sortType={sortType()}
      />
    );
  };

  const renderRow = (row, rowIndex) => {
    const heightIndex = rowIndex + 1;

    return (
      <tr className='table-row' key={`row-${rowIndex}`}>
        {rows[rowIndex].map((cell, cellIndex) => {
          return (
            <TableCell
              key={`${rowIndex}-${cellIndex}`}
              content={rows[rowIndex][cellIndex]}
              fixed={cellIndex === 0}
              height={cellHeights[heightIndex]}
            />
          );
        })}
      </tr>
    );
  };

  const theadMarkup = (
    <tr className='table-row' key='heading'>
      {columns.map(renderColumnHeadingRow)}
    </tr>
  );

  const tbodyMarkup = rows.map(renderRow);

  return (
    <div className='scroll-container'>
      <table className='table' ref={tableRef}>
        <thead>{theadMarkup}</thead>
        <tbody>{tbodyMarkup}</tbody>
      </table>
    </div>
  );
}
