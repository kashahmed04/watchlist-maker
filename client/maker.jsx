
const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleList = (e, onItemAdded) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#titleName').value;
    const status = e.target.querySelector('#titleStatus').value

    if(!title || !status){
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {title, status}, onItemAdded);
    return false;

};

const ListForm = (props) => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUsername = async () => {
            const response = await fetch('/getUserInfo');
            const data = await response.json();
            if (response.ok) {
                setUsername(data.username);
            }
        };

        fetchUsername();
    }, []);

    return (
        <form id="listForm"
            onSubmit={(e) => handleList(e, props.triggerReload)}
            name="listForm"
            action="/maker"
            method="POST"
            className="listForm"
        >
            <h2>{username}'s watchlist</h2> 
            <label htmlFor="name">Title: </label>
            <input id="titleName" type="text" name="name" placeholder="Title Name" />
            <label htmlFor="status">Status: </label> 
            <select id="titleStatus" name="status" defaultValue="Want to watch"> 
                <option value="Watched">Watched</option> 
                <option value="Watching">Watching</option> 
                <option value="Want to watch">Want to Watch</option>
            </select>
            <input className="makeItemSubmit" type="submit" value="Add to List" />
        </form>
    );
};

const WatchlistData = (props) => {
    const [items, setList] = useState(props.items);

    useEffect(() => {
        const loadItemsFromServer = async () => {
            const response = await fetch('/getList');
            const data = await response.json();
            setList(data.items);
        };
        loadItemsFromServer();
    }, [props.reloadItems]);

    const handleDelete = async (id) => {
        helper.sendDelete(`/deleteItem/${id}`, (result) => {
            if(result.message){
                setList(items.filter((item) => item._id !== id));
            }
        });
    }

   //are we allowed to use alert instead of console.log so the user
   //can see the updates**
   //are we allows to have console.log() for errors or no**
    const copyToClipboard = async () => {
        if (items.length === 0) {
            alert("No List to copy!");
            return; 
        }

        const listText = items.map(item => `Title: ${item.title}, Status: ${item.status}`).join('\n');

        //we need a try catch since it's async right (we do not have it for some of our functions though)**
        try {
            await navigator.clipboard.writeText(listText);
            alert("Watchlist copied to clipboard!"); 
        } catch (err) {
            console.error("Failed to copy: ", err); 
            alert("Failed to copy list to clipboard!"); 
        }
    };

    if(items.length === 0){
        return(
            <div className="watchlist">
                <h3 className="emptyList">No Items Yet!</h3>
            </div>
        );
    }
    const itemNodes = items.map(item => {
        return(
            <div key={item.id} className="item">
                <h3 className="titleName">Title: {item.title}</h3>
                <h4 className="titleStatus">Status: {item.status}</h4> 
                <button onClick={() => handleDelete(item._id)} id="deleteButton">Delete</button>
            </div>
        );
    });
    return(
        <div className="watchlist">
            <button onClick={copyToClipboard} id="copyList">Copy List to Clipboard</button> 
            <div>
                {itemNodes}
            </div>
        </div>
   );
};

const handlePasswordChange = (e) => {
    e.preventDefault();
    helper.hideError();

    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;


    if(!pass || !pass2){
        helper.handleError('All fields are required!');
        return false;
    }

    if(pass !== pass2){
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {pass, pass2});

    return false;
}

const ChangePasswordWindow = (props) => {
    return(
        <div class="changeContainer">
            <form id="changeForm"
                name="changeForm"
                onSubmit={handlePasswordChange}
                action="/changePassword"
                method="POST"
                className="changeForm"
            >
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password" />
                <label htmlFor="pass">Retype Password: </label>
                <input id="pass2" type="password" name="pass2" placeholder="retype password" />
                <input className="formSubmit" type="submit" value="Change Password" />

            </form>
        </div>
    );
};

// Function to handle subscription
const handleSubscribe = async (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    helper.hideError(); // Hide any previous error messages

    // do we need a try catch here since it's async**
    // Use sendPost to handle the request to subscribe
    try {
        console.log("hi");
        const result = await helper.sendPost('/subscribe', {}); // Await the sendPost result

        
        if (result.error) {
            console.log("result found in if" + result);
            helper.handleError(result.error); // Handle errors from the response
        } else {
            console.log("result found in else" + result);
            alert('Subscription status updated successfully!'); // Notify the user
        }
    } catch (error) {
        console.error("Failed to subscribe:", error);
        helper.handleError("An error occurred while updating subscription status.");
    }
};

const App = () => {
    const [reloadItems, setReloadItems] = useState(false);

    return(
        <div>
            <div id="makeItem">
                <ListForm triggerReload={() => setReloadItems(!reloadItems)} />
            </div>
            <div id="items">
                <WatchlistData items={[]} reloadItems={reloadItems} />
            </div>
        </div>
    );
};

const init = () => {

    const root = createRoot(document.getElementById('app'));
    root.render( <App /> )

    const ChangePasswordButton = document.getElementById('changePassword');

    const ChangeSubscribeButton = document.getElementById('subscribe');

    ChangePasswordButton.addEventListener('click', (e) =>{
        e.preventDefault();
        root.render( <ChangePasswordWindow />);
        return false;
    });

    ChangeSubscribeButton.addEventListener('click', handleSubscribe);

    //() => {helper.sendPost('/subscribe', {})}

};

window.onload = init;
