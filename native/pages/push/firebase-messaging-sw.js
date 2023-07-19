const version = '2.0.6';
const channel = new BroadcastChannel('service-worker');

CONSOLE = { log: console.log };

console.log = (message, ...args) => {
  message = message || '';

  CONSOLE.log(message, ...args);

  const trimChar = (value, char) => {
    return value?.replace(new RegExp('^' + char + '*(.*?)' + char + '*$'), '$1');
  };

  channel.postMessage([message, args.flatMap(item => trimChar(JSON.stringify(item, null, 2), '"'))].join(' '));
};

console.log('Service worker  :', version);

SW_COUNTER = 0;

setInterval(() => {
  console.log((SW_COUNTER++).toString().padStart(4, '0') + '            :', version);
}, 10000);

/*
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: 'AIzaSyC0bWApWZ1N6_6PCp2Wh3HSTIrINkBXzC8',
  authDomain: 'uva-push-app.firebaseapp.com',
  projectId: 'uva-push-app',
  storageBucket: 'uva-push-app.appspot.com',
  messagingSenderId: '318562901003',
  appId: '1:318562901003:web:baa3384f539b055ec17b0e',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = firebase.messaging();
*/

self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data.json();
  } catch (error) {}

  console.log('Service worker  :', version);
  console.log('Push data       :', data);
  console.log('Push event      :', event);
  console.log();

  event.waitUntil(
    self.registration.showNotification(data?.data?.title ?? 'default title', {
      body: version,
      icon: '/icon.png',
      badge: '/badge.png',
      data: data?.data.link,
    }),
  );
});

self.addEventListener('notificationclick', event => {
  console.log('Service worker  :', version);
  console.log('Click link      :', event.notification.data);

  event.notification.close();

  event.waitUntil(self.clients.openWindow(event.notification.data));
});
