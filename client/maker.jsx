
const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleList = (e, onItemAdded) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#domoName').value;
    const status = e.target.querySelector('#domoStatus').value

    if(!title || !status){
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {title, status}, onItemAdded);
    return false;

};

// will the dropdown always show a value by default and prevent this field 
// from being empty so I dont have to do any error checking server side and it's ok here**
const ListForm = (props) => {
    return(
        <form id="domoForm"
            onSubmit={(e) => handleList(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >

            <label htmlFor="name">Title: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="status">Status: </label> 
            <select id="domoStatus" name="status" defaultValue="Want to watch"> 
                <option value="Watched">Watched</option> 
                <option value="Watching">Watching</option> 
                <option value="Want to watch">Want to Watch</option>
            </select>
            <input className="makeDomoSubmit" type="submit" value="Add to List" />

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
        helper.sendDelete(`/deleteDomo/${id}`, (result) => {
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
            alert("No Domos to copy!");
            return; 
        }

        const listText = items.map(item => `Title: ${item.title}, Status: ${item.status}`).join('\n');

        try {
            await navigator.clipboard.writeText(listText);
            alert("Domo list copied to clipboard!"); 
        } catch (err) {
            console.error("Failed to copy: ", err); 
            alert("Failed to copy to clipboard!"); 
        }
    };

    if(items.length === 0){
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Items Yet!</h3>
            </div>
        );
    }
    const itemNodes = items.map(item => {
        return(
            <div key={item.id} className="domo">
                <img src="assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Title: {item.title}</h3>
                <h4 className="domoStatus">Status: {item.status}</h4> 
                <button onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
        );
    });
    return(
        <div className="domoList">
            <button onClick={copyToClipboard}>Copy List to Clipboard</button> 
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

    const response = helper.sendPost(e.target.action, {pass, pass2});
    
    return false;
}

const ChangePasswordWindow = (props) => {
    return(
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
    );
};


const App = () => {
    const [reloadItems, setReloadItems] = useState(false);

    return(
        <div>
            <div id="makeDomo">
                <ListForm triggerReload={() => setReloadItems(!reloadItems)} />
            </div>
            <div id="domos">
                <WatchlistData items={[]} reloadItems={reloadItems} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> )

    const ChangePasswordButton = document.getElementById('changePassword');

    ChangePasswordButton.addEventListener('click', (e) =>{
        e.preventDefault();
        root.render( <ChangePasswordWindow />);
        return false;
    });


}

window.onload = init;
