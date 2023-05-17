https://firebase.google.com/docs/cloud-messaging/
https://dev.to/onesignal/how-to-integrate-onesignal-into-a-next-js-app-1dmg
https://medium.com/@sarafathulla/how-to-add-firebase-push-notifications-in-next-js-react-8eecc56b5cab
https://blog.logrocket.com/push-notifications-react-firebase/



```javascript
channel = new BroadcastChannel('service-channel');

data = 'nodata';

channel.onmessage = event => {
  console.log('onmessage:', event);
  console.log('token:', event.data.token);
  data = event.data;
};
```

```javascript
self.registration.showNotification('test title', {
  body: 'Test body',
  icon: '/icon-192.png',
  badge: '/icon-192.png',
});
```
