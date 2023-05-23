import { useEffect, useState } from 'react';
import './App.css';
import { version } from '../package.json';
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';
import { IconButton } from './primitives/icon-button';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

declare global {
  interface Navigator {
    userAgentData: {
      brands: Array<{ brand: string; version: string }>;
      mobile: boolean;
      platform: string;
    };
  }
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC0bWApWZ1N6_6PCp2Wh3HSTIrINkBXzC8',
  authDomain: 'uva-push-app.firebaseapp.com',
  projectId: 'uva-push-app',
  storageBucket: 'uva-push-app.appspot.com',
  messagingSenderId: '318562901003',
  appId: '1:318562901003:web:baa3384f539b055ec17b0e',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

console.log(navigator?.userAgent);
console.log();

console.log('initialize-app:', app);

let storageEvent = (event: StorageEvent) => {};

const firebaseDB = 'https://uva-push-app-default-rtdb.europe-west1.firebasedatabase.app/1684831513418/';

window.addEventListener('storage', event => {
  if (event.storageArea === sessionStorage) {
    storageEvent(event);
  }
});

function sendLogs(id: string) {
  const text = sessionStorage.getItem('console.log') ?? '';

  fetch(firebaseDB + id + '/log-data.json', {
    method: 'PUT',
    mode: 'cors',
    body: JSON.stringify(text),
  });
}

function sendToken(id: string, token: string) {
  fetch(firebaseDB + id + '/token.json', {
    method: 'PUT',
    mode: 'cors',
    body: JSON.stringify(token),
  });
}

function clearLog() {
  const text = sessionStorage.getItem('console.log') ?? '';
  const event = {
    key: 'console.log',
    type: 'storage',
    storageArea: sessionStorage,
    oldValue: text,
    newValue: null,
  };

  sessionStorage.removeItem('console.log');
  window.dispatchEvent(new StorageEvent('storage', event));
}

function App() {
  const [log, setLog] = useState('');
  const [token, setToken] = useState('');
  const [name, setName] = useState(
    navigator.userAgentData?.platform ?? (navigator.userAgent.match(/\(.*?(\w+).*?\)/) ?? [])[1] ?? 'no-name',
  );

  const getId = (token: string = '') => {
    let id = 0;

    for (let index = 0; index < token.length; index++) {
      id += token.charCodeAt(index) * index;
    }

    id = id % 100000000;

    return id.toString().padStart(8, '0') + '-' + name.toLowerCase();
  };

  storageEvent = event => {
    setLog(event.newValue ?? '');
  };

  useEffect(() => {
    onMessage(messaging, payload => {
      console.log('Message received. ', payload);
      // ...
    });
    console.log('useEffect');
  }, []);

  return (
    <>
      <h1>Push Test</h1>
      <h2>{version}</h2>
      <h2>{name}</h2>
      <div className="buttons">
        <button
          onClick={async () => {
            const permission = await Notification.requestPermission();

            console.log('permission:', permission);

            const token = await getToken(messaging);
            console.log('token:', token);

            setToken(token);

            sendToken(getId(token), token);
          }}
        >
          Get Token
        </button>
      </div>
      <div className="text">
        <textarea readOnly value={log}></textarea>
      </div>
      <div className="icons">
        <IconButton type="send" onClick={() => sendLogs(getId(token))} />
        <IconButton type="trash" onClick={() => clearLog()} />
      </div>
    </>
  );
}

export default App;
