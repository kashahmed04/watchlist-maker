
const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#domoName').value;
    const status = e.target.querySelector('#domoStatus').value

    if(!title || !status){
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {title, status}, onDomoAdded);
    return false;

};

// will the dropdown always show a  value by default and prevent this field 
// from being empty so i dont have to do any error checking server side and it's ok here**
const DomoForm = (props) => {
    return(
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
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
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />

        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getList');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    const handleDelete = async (id) => {
        helper.sendDelete(`/deleteDomo/${id}`, (result) => {
            if(result.message){
                setDomos(domos.filter((domo) => domo._id !== id));
            }
        });
    }

   // Function to copy the list of Domos to clipboard
   //are we allowed to use alert instead of console.log so the user
   //can see the updates**
   //are we allows to have console.log() for errors or no**
    const copyToClipboard = async () => {
        if (domos.length === 0) {
            alert("No Domos to copy!"); // Alert if no Domos
            return; 
        }

        const domoText = domos.map(domo => `Title: ${domo.title}, Status: ${domo.status}`).join('\n');

        try {
            await navigator.clipboard.writeText(domoText);
            alert("Domo list copied to clipboard!"); // Alert on successful copy
        } catch (err) {
            console.error("Failed to copy: ", err); // Log errors to console
            alert("Failed to copy to clipboard!"); // Alert on failure
        }
    };

    if(domos.length === 0){
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }
    const domoNodes = domos.map(domo => {
        return(
            <div key={domo.id} className="domo">
                <img src="assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Title: {domo.title}</h3>
                <h4 className="domoStatus">Status: {domo.status}</h4> 
                <button onClick={() => handleDelete(domo._id)}>Delete</button>
            </div>
        );
    });
    return(
        <div className="domoList">
            <button onClick={copyToClipboard}>Copy List to Clipboard</button> 
            <div>
                {domoNodes}
            </div>
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return(
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> )
}

window.onload = init;
