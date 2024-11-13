
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('itemMessage').classList.remove('hidden');
};

//is it ok for title to have numbers as well since some titles have numbers in it
//and ony show error when the value is not filled in at all (blank)**

// are the comments ok****

//what is the default value of handler if we do not pass anything in (undefined)
//when we pass the data into the server where does it go first (does it go to
//router since we target the action)(goes to router)
//since we made the method POST it knows to go to the POST version
//of it since we made the method POST right (yes)

// Passes data to the server side and waits for a response
// back in order to guide the user to the correct result. Also,
// potential errors are handled here.****
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    //everything returns JSON from the server right for return type in documentation****
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

// Sends a DELETE request and handles potential errors.
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

