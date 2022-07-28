class callAPI {
  static async get(url, params, authToken) {
    void 0 === params && (params = {});

    let apiResponse = {};
    let reqURL = Object.keys(params).reduce(
      (acc, curr) => `${acc}${curr}=${encodeURIComponent(params[curr])}&`,
      url + '?'
    );

    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: authToken,
        },
      };

      apiResponse = await fetch(reqURL, requestOptions);
    } catch (e) {
      console.log('ERROR in fetching request => ', e);
      throw Error;
    }

    return apiResponse;
  }

  static async post(url, body, authToken) {
    let apiResponse = {};

    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: authToken,
        },
        body: JSON.stringify(body),
      };

      apiResponse = await fetch(url, requestOptions);
    } catch (e) {
      console.log('ERROR in fetching request => ', e);
      throw Error;
    }

    return apiResponse;
  }

  static async patch(url, body, header) {
    let apiResponse = {};
    let authToken = header ? header.Authorization || '' : '';
    try {
      const requestOptions = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
        body: JSON.stringify(body),
      };

      apiResponse = await fetch(url, requestOptions);
    } catch (e) {
      console.log('ERROR in fetching request => ', e);
      throw Error;
    }

    return apiResponse;
  }

  static async put(url, body, authToken) {
    let apiResponse = {};

    try {
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: authToken,
        },
        body: JSON.stringify(body),
      };

      apiResponse = await fetch(url, requestOptions);
    } catch (e) {
      console.log('ERROR in fetching request => ', e);
      throw Error;
    }

    return apiResponse;
  }

  static async put_logout(url, body, authToken, refreshToken) {
    let apiResponse = {};

    try {
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: authToken,
          refreshToken
        },
        body: JSON.stringify(body),
      };

      apiResponse = await fetch(url, requestOptions);
    } catch (e) {
      console.log('ERROR in fetching request => ', e);
      throw Error;
    }

    return apiResponse;
  }

  static async delete(url, body, authToken) {
    let apiResponse = {};

    try {
      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: authToken,
        },
        body: JSON.stringify(body),
      };

      apiResponse = await fetch(url, requestOptions);
    } catch (e) {
      console.log('ERROR in fetching request => ', e);
      throw Error;
    }

    return apiResponse;
  }

  static async upload(url, dataObj, authToken, images = {}) {
    let apiResponse = {};
    let formData = new FormData();

    try {
      for (var key in dataObj) {
          formData.append(key, dataObj[key]);
      }

      for (var key in images) {
        for (var image of images[key]) {
          formData.append(key, image);
        }
      }

      const requestOptions = {
        method: 'POST',
        headers: {
          authorization: authToken,
        },
        body: formData,
      };

      apiResponse = await fetch(url, requestOptions);
    } catch (e) {
      console.log('ERROR in fetching request => ', e);
      throw Error;
    }

    return apiResponse;
  }
}

export default callAPI;
