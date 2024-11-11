
const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');


const ListForm = (props) => {

    const [username, setUsername] = useState('');

    const handleList = (e, onItemAdded) => {
        e.preventDefault();
        helper.hideError();
    
        const title = e.target.querySelector('#titleName').value;
        const status = e.target.querySelector('#titleStatus').value
    
        if(!title || !status){
            helper.handleError('All fields are required!');
            return false;
        }
    
        helper.sendPost(e.target.action, {title, status}, onItemAdded);
        return false;
    
    };

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
        <div id="addItemsList">
        <form id="listForm"
            onSubmit={(e) => handleList(e, props.triggerReload)}
            name="listForm"
            action="/maker"
            method="POST"
            className="listForm"
        >
            <h2 id="usersWatchlist">{username}'s watchlist</h2> 
            <label htmlFor="name" id="titleHeading">Title: </label>
            <input id="titleName" type="text" name="name" placeholder="Title Name" />
            <label htmlFor="status" id="statusHeading">Status: </label> 
            <select id="titleStatus" name="status" defaultValue="Want to watch"> 
                <option value="Watched">Watched</option> 
                <option value="Watching">Watching</option> 
                <option value="Want to watch">Want to Watch</option>
            </select>
            <input className="makeItemSubmit" type="submit" value="Add to List" />
        </form>
        </div>
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
            <div key={item._id} className="item">
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

 //go over***

const ChangePasswordWindow = (props) => {

    const handlePasswordChange = (e) => {
        e.preventDefault();
        helper.hideError();
    
        const pass = e.target.querySelector('#pass').value;
        const pass2 = e.target.querySelector('#pass2').value;
        const oldPass = e.target.querySelector('#oldPass').value;
    
        if(!pass || !pass2){
            helper.handleError('All fields are required!');
            return false;
        }
    
        if(pass !== pass2){
            helper.handleError('Passwords do not match!');
            return false;
        }
    
        if(pass === oldPass){
            helper.handleError('New password cant be current password!');
            return false;
        }
    
        helper.sendPost(e.target.action, {pass, pass2, oldPass});
    
        return false;
    }

    return(
        <div className="changeContainer">
            <form id="changeForm"
                name="changeForm"
                onSubmit={handlePasswordChange}
                action="/changePassword"
                method="POST"
                className="changeForm"
            >
                <label htmlFor="oldPass">Old Password: </label>
                <input id="oldPass" type="password" name="oldPass" placeholder="Password" />
                <label htmlFor="pass">New Password: </label>
                <input id="pass" type="password" name="pass" placeholder="Password" />
                <label htmlFor="pass">Retype New Password: </label>
                <input id="pass2" type="password" name="pass2" placeholder="Retype Password" />
                <input className="formSubmit" type="submit" value="Change Password" />

            </form>
        </div>
    );
};
// Function to handle subscriptio
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

const SubscribeButton = (props) => {
    const handleSubscribe = async (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        helper.hideError(); // Hide any previous error messages
    
    
        helper.sendPost('/subscribe', {}, (result) => {
            if(typeof result.subscribed === 'boolean'){
                const subscribeButton = document.getElementById('subscribe');
                subscribeButton.innerHTML = result.subscribed ? 'Unsubscribe' : 'Subscribe';
            }
        }); 
    };
    
    return(<div className="navlink"><a id = 'subscribe' href="/subscribe" onClick={handleSubscribe}>Subscribe</a></div>);
};


const init = () => {

    const root = createRoot(document.getElementById('app'));
    root.render( <App /> )

    const subscribeRoot = createRoot(document.getElementById('subscribeButton'));
    subscribeRoot.render(<SubscribeButton />);

    const ChangePasswordButton = document.getElementById('changePassword');

    ChangePasswordButton.addEventListener('click', (e) =>{
        e.preventDefault();
        root.render( <ChangePasswordWindow />);
        return false;
    });

    fetch('/getSubscribed').then(res => {
        res.json().then(result => {
            if(typeof result.subscribed === 'boolean'){
                const subscribeButton = document.getElementById('subscribe');
                subscribeButton.innerText = result.subscribed ? 'Unsubscribe' : 'Subscribe';
            }
        });
    });




    //() => {helper.sendPost('/subscribe', {})}

};

window.onload = init;
