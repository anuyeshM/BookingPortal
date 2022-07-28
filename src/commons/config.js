// // const serverURL = 'https://ecommerce.contactless-shoppingdev.com:8088';
// const serverURL = 'http://localhost:8080';

import env from './env';

const serviceURL = env.serverURL;
const gatewayURL = env.gatewayURL;

const serverURL = gatewayURL + '/serviceportal';

const config = {
  api: {
    getConcessionaireLogo: `${serverURL}/api/concessionaireLogo`,
    '': '-------------------------------AUTH----------------------------------------',
    generateOtp: `${serverURL}/api/login/genOtp`,
    loginWithOtp: `${serverURL}/api/login/mobile`,
    // loginWithPwd: `${serverURL}/api/login/email`,
    loginWithPwd: `${gatewayURL}/login/local`,
    updatePassword: `${serverURL}/api/login/resetPwd`,
    // logout: `${serverURL}/api/logout`,
    logout: `${gatewayURL}/logout`,
    '': '-------------------------------CATEGORIES----------------------------------------',
    listServiceByCategory: `${serverURL}/api/category/listservicecategory`,
    listcategory: `${serverURL}/api/category/listcategory`,
    getRequiredSkills: `${serverURL}/api/service/getRequiredSkills`,
    '': '-------------------------------PARENT SERVICE FORM CREATE AND UPDATE----------------------------------------',
    serviceImg: `${serverURL}`,
    categoryImg: `${serverURL}/categoryImages`,
    '': '-------------------------------SERVICE FORM CREATE AND UPDATE----------------------------------------',
    saveService: `${serverURL}/api/service/saveService`,
    updateService: `${serverURL}/api/service/updateService`,
    uploadImage: `${serverURL}/api/service/uploadServiceImages`,
    categorySaveUpdateService: `${serverURL}/api/category/saveCategory`,
    '': '-------------------------------CATEGORIES----------------------------------------',
    serviceByParentId: `${serverURL}/api/service/findAllMatchingServicesByParentId`,
    listVariant: `${serverURL}/api/category/listservicevariant`,
    '': '-------------------------------CATEGORY MASTER----------------------------------------',
    categoryList: `${serverURL}/api/category/listcategory`,
    getCategoryById: `${serverURL}/api/category/getCategoryById/{{categoryId}}`,
    updateCategory: `${serverURL}/api/category/updateCategory`,
    deleteCategory: `${serverURL}/api/category/deleteCategory`,
    '': '-------------------------------SERVICE LISTING----------------------------------------',
    serviceList: `${serverURL}/api/service/findAllServices`,
    getServiceById: `${serverURL}/api/service/fetchServiceById/{{serviceId}}`,
    deleteService: `${serverURL}/api/service/deleteService`,
    '': '-------------------------------SERVICE VARIANTS----------------------------------------',
    saveServiceVariant: `${serverURL}/api/service/saveServiceVariant`,
    updateServiceVariant: `${serverURL}/api/service/updateServiceVariant`,
    mergeService: `${serverURL}/api/service/mergeService`,
    priceDefinition: `${serverURL}/api/service/priceDefinition`,
  },
  date: {
    displayFormat: 'DD MMM, YYYY, HH:mm',
    timeFormat: 'HH:mm',
    dateFormat: 'DD MMM, YYYY,'
  },
  ux: {
    throttleControl: 500
  },
   appDetails: {
    appName: "pax"
  },
  auth: {},
  url: {
    serverURL
  },
  currencyList: [
    {
      value: 'Rs',
      label: 'INR'
    },
    {
      value: '$',
      label: 'USD'
    },
    {
      value: 'Euro',
      label: 'EUR'
    }
  ],
  daysOfWeek: [
    {
      day: 'Mon',
      isActive: false,
      startHour: '00',
      startMin: '00',
      endHour: '23',
      endMin: '59'
    },
    {
      day: 'Tue',
      isActive: false,
      startHour: '00',
      startMin: '00',
      endHour: '23',
      endMin: '59'
    },
    {
      day: 'Wed',
      isActive: false,
      startHour: '00',
      startMin: '00',
      endHour: '23',
      endMin: '59'
    },
    {
      day: 'Thu',
      isActive: false,
      startHour: '00',
      startMin: '00',
      endHour: '23',
      endMin: '59'
    },
    {
      day: 'Fri',
      isActive: false,
      startHour: '00',
      startMin: '00',
      endHour: '23',
      endMin: '59'
    },
    {
      day: 'Sat',
      isActive: false,
      startHour: '00',
      startMin: '00',
      endHour: '23',
      endMin: '59'
    },
    {
      day: 'Sun',
      isActive: false,
      startHour: '00',
      startMin: '00',
      endHour: '23',
      endMin: '59'
    }
  ],
  features: [
    {
      featureName: '',
      featureDesc: '',
      featureImageUrl: ''
    }
  ],
  actions: [
    {
        id: 'services',
        display: 'Booking',
        subItem: [
          {
            id: 'list',
            display: 'Bookings'
          },
          {
            id: 'categories',
            display: 'Current Bookings'
          }
        ]
      }
  ],

  movementType: [
    {
      value: 'All',
      label: 'All'
    },
    {
      value: 'Departure',
      label: 'Departure'
    },
    {
      value: 'Arrival',
      label: 'Arrival'
    }
  ],
  sectorType: [
    {
      value: 'All',
      label: 'All'
    },
    {
      value: 'International',
      label: 'International'
    },
    {
      value: 'Domestic',
      label: 'Domestic'
    }
  ],
  listMovementType: [
    {
      value: 'View All',
      label: 'View All'
    },
    {
      value: 'All',
      label: 'All'
    },
    {
      value: 'Departure',
      label: 'Departure'
    },
    {
      value: 'Arrival',
      label: 'Arrival'
    }
  ],
  listSectorType: [
    {
      value: 'View All',
      label: 'View All'
    },
    {
      value: 'All',
      label: 'All'
    },
    {
      value: 'International',
      label: 'International'
    },
    {
      value: 'Domestic',
      label: 'Domestic'
    }
  ],
  listAuthFlag: [
    {
      value: 'View All',
      label: 'View All'
    },
    {
      value: 'Approved',
      label: 'Approved'
    },
    {
      value: 'Pending',
      label: 'Pending'
    }
  ],
  listActiveFlag: [
    {
      value: 'View All',
      label: 'View All'
    },
    {
      value: 'Active',
      label: 'Active'
    },
    {
      value: 'Inactive',
      label: 'Inactive'
    }
  ]
};

export default config;
