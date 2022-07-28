import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';

import EditComponent from './subcomponent/EditComponent';
import EditOrDelete from './subcomponent/editOrDelete';
import Info from './subcomponent/info';
import Download from './subcomponent/download';
import Loader from '../../commons/loader';
import PushAlert from '../../commons/notification';

import 'bootstrap/dist/css/bootstrap.min.css';
import './table.css';

export default function ServiceTable(props) {
  const [isServerSidePagination] = useState(props.config.pagination.isServerSide);

  const getActionComponent = (e) => {
    return (
      'info' === e 
      ? Info 
      : 'edit' === e 
      ? EditComponent 
      : 'download' === e 
      ? Download 
      : 'editOrDelete' === e
      ? EditOrDelete
      : null
    )
  };

  const pages = useMemo(() => props.config.pagination, []);
  const filters = useMemo(() => props.config.filter, []);
  const sort = useMemo(() => props.config.sort, []);
  const columns = useMemo(() => props.config.header, []);
  const sortOrd = useMemo(() => props.config.sortOrder, []);
  const ActComp = useMemo(() => getActionComponent(props.actionType), []);
  const data = props.data;

  /**
   * SERVER SIDE PAGINATION
   * + nextPage, previousPage, firstPage, lastPage
   *   - will be overridden
   *   - each representing an api call to update data object in parent component
   * + DefaultColumnFilter
   *   - will be replaced with another function
   *   - function to do api call and filter results
   *   - debatable : if filtering is to be cascaded.
   *
   * NOTE: search must be modified when going for server side pagination
   */

  function DefaultColumnFilter({ column: { filterValue: f, preFilteredRows: l, setFilter: t } }) {
    return (
      <input
        className="form-control"
        value={f || ''}
        onChange={(e) => {
          t(e.target.value || undefined);
        }}
        placeholder={`Search ${l.length} records...`}
      />
    );
  }
  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows, //page used in case of pagination
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        pageIndex: pages.initialPageIndex,
        pageSize: pages.pageSize,
        sortBy: sortOrd,
      },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  function handleGoToPage(e) {
    console.log('serverSide', isServerSidePagination);
    isServerSidePagination === true ? props.handleGoToPage(e) : gotoPage(e);
  }

  function handleNext() {
    isServerSidePagination === true ? props.handleNextPage() : nextPage();
  }
  function handlePrevious() {
    isServerSidePagination === true ? props.handlePreviousPage() : previousPage();
  }

  function handleSort(e, params, column) {
    isServerSidePagination
      ? props.sorting
        ? sort[column.id]
          ? handleHeaderClick(column)
          : PushAlert.info(`Sorting not Available for ${column.Header}`)
        : PushAlert.info('Sorting is not available')
      : params.onClick(e);

    function handleHeaderClick(column) {
      const element = column.Header.replaceAll(' ', '');
      if (props.sortEle === element) {
        if (props.sortOrder === null) props.setSortValue({ element, order: 1 });
        else if (props.sortOrder === +1) props.setSortValue({ element, order: -1 });
        else if (props.sortOrder === -1) props.setSortValue({ element, order: null });
      } else {
        props.setSortValue({ element, order: 1 });
      }
    }
  }

  function getSortIcon(column) {
    if (
      isServerSidePagination === true &&
      (props.sortEle === '' || props.sortEle === column.Header.replaceAll(' ', ''))
    ) {
      if (props.sortOrder === 1) return ' ▴';
      else if (props.sortOrder === -1) return ' ▾';
      else return '';
    }
  }

  return (
    <div className="table-wrapper">
      <div className={`data-table ${props.tableClass}`}>
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    <div
                      onClick={(e) => handleSort(e, { ...column.getSortByToggleProps() }, column)}
                    >
                      {column.render('Header')}
                      {column.isSorted ? (column.isSortedDesc ? ' ▾' : ' ▴') : getSortIcon(column)}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>
                        {ActComp &&
                        ('' === cell.column.Header.trim() || 'Action' === cell.column.Header.trim())
                          ? cell.render(
                            <ActComp 
                              data={row} 
                              metaData={props.metaData}
                              onClick={props.onClick}
                              onEdit={props.onEdit}
                              onDelete={props.onDelete}
                              onInfo={props.onInfo}
                              onDownload={props.onDownload} 
                              renderEnterButton={props.renderEnterButton}
                              onEnter={props.onEnter} 
                              fromVariantsTable={props.fromVariantsTable}
                            />
                          )
                          : cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {props.isLoading ? (
          <Loader />
        ) : page.length ? null : (
          <div
            style={{
              fontSize: '15px',
              fontWeight: '600',
              padding: '2rem 0',
              display: 'flex',
              height: '10rem',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#ffffff',
            }}
          >
            No Data Found!
          </div>
        )}
      </div>
      <div className="pagination-wrapper">
        <ul className="pagination">
          <li
            style={{
              WebkitBorderTopLeftRadius: '10px'
            }}
            className="page-item"
            onClick={() => handleGoToPage(0)}
            disabled={!canPreviousPage}
          >
            <a className="page-link">First</a>
          </li>
          <li className="page-item" onClick={() => handlePrevious()} disabled={!canPreviousPage}>
            <a className="page-link">{'<'}</a>
          </li>
          <li className="page-item" onClick={() => handleNext()} disabled={!canNextPage}>
            <a className="page-link">{'>'}</a>
          </li>
          <li
            className="page-item"
            onClick={() => {
              isServerSidePagination === true ? handleGoToPage(props.maxPage - 1) : handleGoToPage(pageCount - 1);
            }}
            disabled={!canNextPage}
          >
            <a className="page-link">Last</a>
          </li>
          {isServerSidePagination === false ? (
            <li className="page-item">
              <a className="page-link">
                Page{' '}
                <strong>
                  {Math.min(pageIndex + 1, pageOptions.length)} of {pageOptions.length}
                </strong>{' '}
              </a>
            </li>
          ) : (
            <li className="page-item">
              <a className="page-link">
                Page{' '}
                <strong>
                  {props.pageCount + 1} of {props.maxPage}
                </strong>{' '}
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
