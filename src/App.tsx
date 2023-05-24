import { useEffect, useRef, useState } from 'react';
import './App.css';
import { version } from '../package.json';
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken, isSupported, Messaging } from 'firebase/messaging';
import { IconButton } from './primitives/icon-button';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: 'AIzaSyC0bWApWZ1N6_6PCp2Wh3HSTIrINkBXzC8',
  authDomain: 'uva-push-app.firebaseapp.com',
  projectId: 'uva-push-app',
  storageBucket: 'uva-push-app.appspot.com',
  messagingSenderId: '318562901003',
  appId: '1:318562901003:web:baa3384f539b055ec17b0e',
};

declare global {
  interface Navigator {
    userAgentData: {
      brands: Array<{ brand: string; version: string }>;
      mobile: boolean;
      platform: string;
    };
  }
}

const channel = new BroadcastChannel('service-worker');

channel.onmessage = event => {
  console.log(event.data);
};

// Your web app's Firebase configuration

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

function getDeviceName(token: string = '') {
  const deviceName =
    navigator.userAgentData?.platform || (navigator.userAgent.match(/\(.*?(\w+).*?\)/) || [])[1] || 'no-name';
  let id = 0;

  for (let index = 0; index < token.length; index++) {
    id += token.charCodeAt(index) * index;
  }

  id = id % 100000000;

  return id.toString().padStart(8, '0') + '-' + deviceName.toLowerCase();
}

function App() {
  const initialized = useRef(false);
  const [log, setLog] = useState('');
  const [token, setToken] = useState('');
  const [messaging, setMessaging] = useState<Messaging | undefined>(undefined);
  const [supported, setSupported] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | undefined | null>(undefined);

  const initialize = async () => {
    try {
      const app = initializeApp(firebaseConfig);

      console.log('Initialized     :', app.options.projectId);
      console.log('Version         :', version);

      const messaging = getMessaging(app);

      setMessaging(messaging);

      onMessage(messaging, payload => {
        console.log('Message received :', payload);
      });
      console.log('Message handler : installed');

      if (window.Notification?.permission === 'granted') {
        const token = await getToken(messaging);

        setToken(token);

        console.log('Token           :', token);
      }
      console.log();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;

    storageEvent = event => setLog(event.newValue ?? '');

    console.log(navigator?.userAgent);
    console.log();

    if (window.location.search) {
      console.log('Query arguments :', window.location.search);
      console.log();
    }

    navigator.serviceWorker.getRegistrations().then(registrations => {
      const registration = registrations.find(item => item.active?.scriptURL?.includes?.('/firebase-messaging-sw.js'));

      setRegistration(registration || null);
    });

    isSupported().then(supported => {
      if (!supported) {
        console.log('Push not supported!');
        return;
      }

      setSupported(true);
    });
  }, []);

  return (
    <>
      <h1>Push Test</h1>
      <h2>{version}</h2>
      <span className="device-name">{getDeviceName(token)}</span>
      <div className="buttons">
        <button
          disabled={registration === undefined || registration !== null}
          onClick={async () => {
            try {
              console.log('Requesting      : registration');

              const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
                scope: '/firebase-cloud-messaging-push-scope',
              });

              // console.log('waiting         :', registration?.waiting);
              // console.log('installing      :', registration?.installing);
              // console.log('state           :', registration?.active?.state);
              // console.log('registerd       :', registration);
              setTimeout(() => {
                console.log('registerd       :', registration?.active?.scriptURL);
                console.log();
              }, 1000);

              setRegistration(registration);
            } catch (error) {
              console.log(error);
              console.log();
            }
          }}
        >
          Register
        </button>

        <button disabled={!supported || messaging !== undefined} onClick={() => initialize()}>
          Initialize
        </button>
        <button
          disabled={window.Notification === undefined || window.Notification?.permission !== 'default'}
          onClick={async () => {
            try {
              console.log('Requesting      : permission');

              const permission = await Notification.requestPermission();

              console.log('Permission      :', permission);
            } catch (error) {
              console.log(error);
            }
            console.log();
          }}
        >
          Permission
        </button>

        <button
          disabled={registration === undefined || registration === null}
          onClick={async () => {
            try {
              console.log('Requesting      : unregister');

              await registration?.unregister();

              setRegistration(null);

              console.log('unregisterd     : oke');
            } catch (error) {
              console.log(error);
            }
            console.log();
          }}
        >
          Unregister
        </button>

        <button
          disabled={messaging === undefined || !registration || window.Notification?.permission !== 'granted'}
          onClick={async () => {
            try {
              console.log('Requesting      : token');

              if (messaging && registration) {
                const token = await getToken(messaging, {
                  serviceWorkerRegistration: registration,
                });
                console.log('Token           :', token);

                setToken(token);

                sendToken(getDeviceName(token), token);
              }
              console.log();
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Token
        </button>
      </div>
      <div className="text">
        <textarea readOnly value={log}></textarea>
      </div>
      <div className="icons">
        <IconButton type="copy" onClick={() => navigator.clipboard.writeText(token)} disabled={token === ''} />
        <IconButton type="send" onClick={() => sendLogs(getDeviceName(token))} />
        <IconButton type="trash" onClick={() => clearLog()} />
      </div>
    </>
  );
}

export default App;
