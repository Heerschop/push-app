import { useEffect, useState } from 'react';
import './App.css';
import { version } from '../package.json';
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

console.log('initialize-app:', app);

function App() {
  const [token, setToken] = useState('');
  const [permission, setPermission] = useState('');

  useEffect(() => {
    onMessage(messaging, payload => {
      console.log('Message received. ', payload);
      // ...
    });
    console.log('useEffect');
  });

  return (
    <>
      <h1>Push Test</h1>
      <h4>{version}</h4>
      <div className="card">
        <button
          onClick={async () => {
            const permission = await Notification.requestPermission();

            setPermission(permission);

            const token = await getToken(messaging);

            setPermission(token);
          }}
        >
          Get Token
        </button>
        <div>
          {token}
          {permission}
        </div>
      </div>
    </>
  );
}

export default App;
