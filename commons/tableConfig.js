const tableConfig = {
  adService: {
    header: [
      {
        Header: 'Variant ID',
        accessor: '_id',
      },
      {
        Header: 'Variant',
        accessor: 'title',
      },
      {
        Header: 'Movement Type',
        accessor: 'movementTypeClone',
      },
      {
        Header: 'Sector',
        accessor: 'sectorClone',
      },
      {
        Header: 'Approval Status',
        accessor: 'authFlagClone',
      },
      {
        Header: 'Active Status',
        accessor: 'activeFlagClone',
      },
      {
        Header: 'Date Created',
        accessor: 'createdAtClone',
      },
      {
        Header: 'Date Modified',
        accessor: 'updatedAtClone',
      },
      {
        Header: 'Action',
        accessor: ' ',
      },
    ],
    pagination: {
      isServerSide: true,
      initialPageIndex: 0,
      pageSize: 500,
    },
    sortOrder: [],
  },

  category: {
    header: [
      {
        Header: 'Bookin ID',
        accessor: '_id',
      },
      {
        Header: 'Services',
        accessor: 'categoryName',
      },
      {
        Header: 'Time',
        accessor: 'createdAt',
      },
      {
        Header: 'Date',
        accessor: '  ',
      },
      {
        Header: 'Status',
        accessor: 'activeFlag',
      },
      {
        Header: 'Action',
        accessor: ' ',
      },
    ],
    pagination: {
      isServerSide: false,
      initialPageIndex: 0,
      pageSize: 10,
    },
    sortOrder: [],
  },

  serviceList: {
    header: [
      {
        Header: 'Service ID',
        accessor: '_id',
      },
      {
        Header: 'Service',
        accessor: 'servicename',
      },
      {
        Header: 'Movement Type',
        accessor: 'movementTypeClone',
      },
      {
        Header: 'Sector',
        accessor: 'sectorClone',
      },
      {
        Header: 'Approval Status',
        accessor: 'authFlagClone',
      },
      {
        Header: 'Active Status',
        accessor: 'activeFlagClone',
      },
      {
        Header: 'Action',
        accessor: ' ',
      },
    ],
    pagination: {
      isServerSide: false,
      initialPageIndex: 0,
      pageSize: 8,
    },
    sortOrder: [],
  },
};

export default tableConfig;
