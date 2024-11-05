
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('domoMessage').classList.remove('hidden');
};

//is it ok for title to have numbers as well since some titles have numbers in it
//and ony show error when the value is not filled in at all (blank)**

//what is the default value of handler if we do not pass anything in (undefined)
//when we pass the data into the server where does it go first (does it go to
//router since we target the action)(goes to router)
//since we made the method POST it knows to go to the POST version
//of it since we made the method POST right (yes)
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();

    document.getElementById('domoMessage').classList.add('hidden');

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

const hideError = () => {
    document.getElementById('domoMessage').classList.add('hidden');
};
  
module.exports = {
  handleError,
  sendPost,
  sendDelete,
  hideError,
};

