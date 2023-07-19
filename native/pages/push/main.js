let initializeApp = null;
let getToken = null;
let messaging = null;
let supported = !!window.Notification && !!window.navigator.serviceWorker;
let registration = null;
let token = '';

const channel = new BroadcastChannel('service-worker');
const firebaseConfig = {
  apiKey: 'AIzaSyC0bWApWZ1N6_6PCp2Wh3HSTIrINkBXzC8',
  authDomain: 'uva-push-app.firebaseapp.com',
  databaseURL: 'https://uva-push-app-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'uva-push-app',
  storageBucket: 'uva-push-app.appspot.com',
  messagingSenderId: '318562901003',
  appId: '1:318562901003:web:baa3384f539b055ec17b0e',
};
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

const firebaseDB = firebaseConfig.databaseURL + '/1684831513418/';

window.addEventListener('storage', event => {
  if (event.storageArea === sessionStorage) {
    if (element.logTextarea) element.logTextarea.value = event.newValue ?? '';
  }
});

channel.onmessage = event => {
  console.log(event.data);
};

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

if (!supported) console.log('Push not supported!');

function sleep(milliseconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), milliseconds);
  });
}

function updateState() {
  if (element.permissionButton) {
    element.permissionButton.disabled =
      window.Notification === undefined || window.Notification?.permission !== 'default';
  }
  if (element.initializeButton) {
    element.initializeButton.disabled = !supported || messaging !== null || !!initializeApp;
  }
  if (element.registerButton) {
    element.registerButton.disabled = !!registration || !navigator.serviceWorker;
  }
  if (element.unregisterButton) {
    element.unregisterButton.disabled = !registration;
  }
  if (element.updateButton) {
    element.updateButton.disabled = !registration;
  }

  if (element.tokenButton) {
    element.tokenButton.disabled =
      !messaging || !registration || window.Notification?.permission !== 'granted' || !getToken;
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
    let getMessaging = null;
    let onMessage = null;

    console.log('Requesting      : initialization');

    ({ initializeApp } = await import('https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js'));
    ({ getMessaging, onMessage, getToken } = await import(
      'https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging.js'
    ));

    const app = initializeApp(firebaseConfig);

    messaging = getMessaging(app);

    onMessage(messaging, payload => {
      console.log('Message received :', payload);
    });

    console.log('Initialized     :', app.options.projectId);
  } catch (error) {
    console.log(error);
  }

  console.log();

  updateState();
};

window.onRegisterClick = async () => {
  try {
    console.log('Requesting      : registration');

    registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/firebase-cloud-messaging-push-scope',
    });

    await sleep(1000);

    console.log('Registerd       :', registration?.active?.scriptURL);
  } catch (error) {
    console.log(error);
  }

  console.log();

  updateState();
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
  } catch (error) {
    console.log(error);
  }

  console.log();

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

  updateState();
};

window.onUnregisterClick = async () => {
  try {
    console.log('Requesting      : unregister');

    await registration?.unregister();

    registration = null;

    console.log('Unregister      : oke');
  } catch (error) {
    console.log(error);
  }

  console.log();

  updateState();
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
