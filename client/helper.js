
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('itemMessage').classList.remove('hidden');
};

// Passes data to the server side and waits for a response
// back in order to guide the user to the correct result. Also,
// potential errors are handled here.
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    document.getElementById('itemMessage').classList.add('hidden');

    if(result.redirect) {
      window.location = result.redirect;
    }
  
    if(result.error) {
      handleError(result.error);
    }
    if(handler){
      handler(result);
    }
};

// Sends a DELETE request to the server 
// and waits for a response.Potential errors are
// handled here as well.
const sendDelete = async (url, handler) => {
  const response = await fetch(url, {
      method: 'DELETE',
  });
  const result = await response.json();

  if (result.error) {
      handleError(result.error);
      return;
  }

  if (handler) {
      handler(result);
  }
};

// Hides the error message.
const hideError = () => {
  document.getElementById('itemMessage').classList.add('hidden');
};
  
// Export the functions.
module.exports = {
  handleError,
  sendPost,
  sendDelete,
  hideError,
};

