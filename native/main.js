// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import {
  getMessaging,
  onMessage,
  getToken,
  isSupported,
} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

window.addEventListener('storage', event => {
  if (event.storageArea === sessionStorage) {
    if (element.logTextarea) element.logTextarea.value = event.newValue ?? '';
  }
});

const channel = new BroadcastChannel('service-worker');

channel.onmessage = event => {
  console.log(event.data);
};

let messaging = null;
let supported = window.Notification !== null;
let registration = null;
let token = '';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC0bWApWZ1N6_6PCp2Wh3HSTIrINkBXzC8',
  authDomain: 'uva-push-app.firebaseapp.com',
  databaseURL: 'https://uva-push-app-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'uva-push-app',
  storageBucket: 'uva-push-app.appspot.com',
  messagingSenderId: '318562901003',
  appId: '1:318562901003:web:baa3384f539b055ec17b0e',
};

const firebaseDB = firebaseConfig.databaseURL + '/1684831513418/';

const element = {
  logTextarea: document.querySelector('#log-textarea'),
  permissionButton: document.querySelector('#permission-button'),
  initializeButton: document.querySelector('#initialize-button'),
  registerButton: document.querySelector('#register-button'),
  unregisterButton: document.querySelector('#unregister-button'),
  updateButton: document.querySelector('#update-button'),
  tokenButton: document.querySelector('#token-button'),
  copyButton: document.querySelector('#copy-button'),
  deviceNameSpan: document.querySelector('#device-name'),
};

function updateState() {
  if (element.permissionButton) {
    element.permissionButton.disabled =
      window.Notification === undefined || window.Notification?.permission !== 'default';
  }
  if (element.initializeButton) {
    element.initializeButton.disabled = !supported || messaging !== null;
  }
  if (element.registerButton) {
    element.registerButton.disabled = !!registration;
  }
  if (element.unregisterButton) {
    element.unregisterButton.disabled = !registration;
  }
  if (element.updateButton) {
    element.updateButton.disabled = !registration;
  }

  if (element.tokenButton) {
    element.tokenButton.disabled = !messaging || !registration || window.Notification?.permission !== 'granted';
  }

  if (element.copyButton) {
    element.copyButton.disabled = !token;
  }

  if (element.deviceNameSpan) {
    element.deviceNameSpan.innerHTML = getDeviceName(token);
  }
}

function getDeviceName(token = '') {
  const deviceName =
    navigator.userAgentData?.platform || (navigator.userAgent.match(/\(.*?(\w+).*?\)/) || [])[1] || 'no-name';
  let id = 0;

  for (let index = 0; index < token.length; index++) {
    id += token.charCodeAt(index) * index;
  }

  id = id % 100000000;

  return id.toString().padStart(8, '0') + '-' + deviceName.toLowerCase();
}

function sendLogs(id) {
  const text = sessionStorage.getItem('console.log') ?? '';

  fetch(firebaseDB + id + '/log-data.json', {
    method: 'PUT',
    mode: 'cors',
    body: JSON.stringify(text),
  });
}

function sendToken(id, token) {
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

console.log(navigator?.userAgent);
console.log();

if (window.location.search) {
  console.log('Query arguments :', window.location.search);
  console.log();
}

window?.navigator?.serviceWorker?.getRegistrations?.().then(registrations => {
  registration = registrations.find(item => item.active?.scriptURL?.includes?.('/firebase-messaging-sw.js'));
  updateState();
});

// isSupported().then(value => {
//   if (!value) {
//     console.log('Push not supported!');
//     return;
//   }

//   supported = true;

//   updateState();
// });

updateState();

window.onPermissionClick = async () => {
  try {
    console.log('Requesting      : permission');

    const permission = await Notification.requestPermission();

    console.log('Permission      :', permission);
  } catch (error) {
    console.log(error);
  }
  console.log();

  updateState();
};

window.onInitializeClick = async () => {
  try {
    console.log('Requesting      : initialization');
    const app = initializeApp(firebaseConfig);

    messaging = getMessaging(app);

    onMessage(messaging, payload => {
      console.log('Message received :', payload);
    });

    console.log('Initialized     :', app.options.projectId);

    console.log();
  } catch (error) {
    console.log(error);
  }

  updateState();
};

window.onRegisterClick = async () => {
  try {
    console.log('Requesting      : registration');

    registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/firebase-cloud-messaging-push-scope',
    });

    setTimeout(() => {
      console.log('Registerd       :', registration?.active?.scriptURL);
      console.log();
      updateState();
    }, 1000);
  } catch (error) {
    console.log(error);
    console.log();
  }
};

window.onTokenClick = async () => {
  try {
    console.log('Requesting      : token');

    if (messaging && registration) {
      token = await getToken(messaging, {
        serviceWorkerRegistration: registration,
      });

      console.log('Token           :', token);

      sendToken(getDeviceName(token), token);
    }
    console.log();
  } catch (error) {
    console.log(error);
  }

  updateState();
};

window.onUpdateClick = async () => {
  try {
    console.log('Requesting      : update');

    await registration?.update();

    console.log('Update          : oke');
  } catch (error) {
    console.log(error);
  }
  console.log();
};

window.onUnregisterClick = async () => {
  try {
    console.log('Requesting      : unregister');

    await registration?.unregister();

    registration = null;

    updateState();

    console.log('Unregister      : oke');
  } catch (error) {
    console.log(error);
  }
  console.log();
};

window.onCopyClick = () => {
  navigator.clipboard.writeText(token);
};

window.onLogClick = () => {
  sendLogs(getDeviceName(token));
};

window.onTrashClick = () => {
  clearLog();
};
