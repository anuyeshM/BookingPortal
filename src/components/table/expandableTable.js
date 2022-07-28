import React, { useMemo } from "react";
import { useTable, useExpanded, usePagination } from 'react-table';

import Loader from '../../commons/loader';
import './table.css';

function Table({ columns: userColumns, data, tableClass, pages, isLoading }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { expanded, pageIndex }
  } = useTable(
    {
      columns: userColumns,
      data,
      initialState: {
        pageIndex: pages.initialPageIndex,
        pageSize: pages.pageSize,
      }
    },
    useExpanded,
    usePagination
  );

  return (
    <div className='table-wrapper'>
      <div className={`data-table ${tableClass}`}>
        <table className='table' {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        {isLoading ? (
          <Loader />
        ) : page.length ? null : (
          <div
            style={{
              fontSize: '12pt',
              fontWeight: '500',
              padding: '2rem 0',
              display: 'flex',
              height: '10rem',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            No Data Found!
          </div>
        )}
      </div >
      <div className='pagination-wrapper'>
        <ul className='pagination'>
          <li
            className='page-item'
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}>
            <a className='page-link'>First</a>
          </li>
          <li
            className='page-item'
            onClick={() => previousPage()}
            disabled={!canPreviousPage}>
            <a className='page-link'>{'<'}</a>
          </li>
          <li
            className='page-item'
            onClick={() => nextPage()}
            disabled={!canNextPage}>
            <a className='page-link'>{'>'}</a>
          </li>
          <li
            className='page-item'
            onClick={() => {
              gotoPage(pageCount - 1)
            }}
            disabled={!canNextPage}>
            <a className='page-link'>Last</a>
          </li>
          <li>
            <a className='page-link'>
              Page{' '}
              <strong>
                {Math.min(pageIndex + 1, pageOptions.length)} of {pageOptions.length}
              </strong>{' '}
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

function ExpandableTableComponent(props) {
  const pages = useMemo(() => props.config.pagination, []);
  const cols = useMemo(() => props.config.header, []);
  const data = props.data;

  const columns = React.useMemo(
    () => [
      {
        id: 'expander', // Make sure it has an ID
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
          <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? '👇' : '👉'}
          </span>
        ),
        Cell: ({ row }) =>
          row.canExpand ? (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  paddingLeft: `${row.depth * 2}rem`,
                },
              })}
            >
              {row.isExpanded ? '👇' : '👉'}
            </span>
          ) : null,
      },
      ...cols
    ],
    []
  )
  return (
    <Table
      columns={columns}
      data={data}
      tableClass={props.tableClass}
      pages={pages}
      isLoading={props.isLoading}
    />
  )
}

export default ExpandableTableComponent;