async function FilterPaginationData({
  createNewArray = false,
  state,
  data,
  page,
  countRoute,
  data_to_send, // This is the query you're passing
}) {
  let obj = {}; // Define the obj variable here to ensure it's always returned
  console.log({
    createNewArray,
    state,
    data,
    page,
    countRoute,
    data_to_send, // Make sure to log data_to_send to debug
  });

  // Ensure state.results is initialized
  if (!state.results) {
    state.results = [];
  }

  try {
    // If we're not creating a new array (so it's for appending data)
    if (data != null && !createNewArray) {
      // Filter out already existing blog entries based on blog_id
      const newData = data.filter(
        (item) => !state.results.some((existingItem) => existingItem.blog_id === item.blog_id)
      );

      // Make the API call to get the count
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/all-latestlblog-count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data_to_send }), // Pass data_to_send here
      });
      // Parse the response
      const resData = await response.json();
      // console.log(resData);

      let totalDocs = 0;

      if (response.ok && resData.success) {
        totalDocs = resData.count; // Assuming 'count' holds the total number of documents
      }

      // Construct the new state with the combined results and totalDocs
      obj = { ...state, results: [...state.results, ...newData], page, totalDocs };

    } else {
      // If creating a new array, reset the state and fetch the count data
      obj = { results: data, page: 1 };

      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/${countRoute}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data_to_send }), // Pass data_to_send here as well
      });

      // Parse the response
      const resData = await response.json();
      let totalDocs = 0;

      if (response.ok && resData.success) {
        totalDocs = resData.count; // Safely destructure and get the totalDocs count
      }

      // Set the state with the new data and totalDocs
      obj = { results: data, page: 1, totalDocs };
    }
  } catch (error) {
    console.log('Error in the API request:', error);
    obj = { results: [], page: 1, totalDocs: 0 }; // Set fallback values in case of an error
  }

  // Always return `obj` to avoid undefined issues
  return obj;
}

export default FilterPaginationData;
