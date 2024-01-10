export function fetchResponseHandler<TReturn = unknown>() {
  return async (response: Response): Promise<TReturn> => {
    if (response.ok) {
      return await response.json();
    }
    let data = null;
    try {
      data = await response.json();
    } catch (e) {
      // no response body
    }
    return Promise.reject({
      status: response.status,
      statusText: response.statusText,
      data,
    });
  };
}
