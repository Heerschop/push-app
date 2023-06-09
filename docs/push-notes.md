### Examples
* https://taoshu.in/web/push-demo/
* https://devtails.xyz/@adam/how-to-setup-web-push-notifications-in-ios-safari
* https://cleverpush.com/en/test-notifications/
* https://web-push-book.gauntface.com/demos/notification-examples/
* https://docs.wonderpush.com/docs/web-push-notifications-quickstart

### Errors
* >>>>>>>>>: https://bugs.webkit.org/show_bug.cgi?id=252544#c18
* https://invisioncommunity.com/forums/topic/473188-new-push-notifications-don%E2%80%99t-link-to-notificationtopic/

* https://firebase.google.com/docs/cloud-messaging/
* https://dev.to/onesignal/how-to-integrate-onesignal-into-a-next-js-app-1dmg
* https://medium.com/@sarafathulla/how-to-add-firebase-push-notifications-in-next-js-react-8eecc56b5cab
* https://blog.logrocket.com/push-notifications-react-firebase/
* https://developer.apple.com/documentation/usernotifications/sending_web_push_notifications_in_web_apps_safari_and_other_browsers

* https://github.com/firebase/firebase-js-sdk/blob/master/packages/app-compat/src/index.ts
* https://github.com/firebase/firebase-js-sdk/blob/master/packages/messaging-compat/src/messaging-compat.ts
* https://github.com/firebase/firebase-js-sdk/blob/master/packages/messaging/src/listeners/sw-listeners.ts
* https://developer.apple.com/forums/tags/wwdc2022-10098

* https://github.com/firebase/firebase-js-sdk/issues/7309
* https://github.com/WebKit/WebKit/pull/11848

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
  icon: '/icon.png',
  badge: '/icon.png',
});
```
```bash
DATA='
{
  "to": "1122334455",
  "data": {
    "title": "New grade",
    "body": "A new grade has been registered in SIS.",
    "link":"https://student-dev.ic.uva.nl/en/study-results?gradeId=178091-99999GG3Y"
  },
  "priority": 10
}
'


curl --request POST                                         \
    --header 'Authorization: key='$SERVER_KEY               \
    --Header 'Content-Type: application/json'               \
    --data   ${DATA/DATE/$(date -u +"%Y-%m-%dT%H:%M:%SZ")}  \
    https://uva-push-app-default-rtdb.europe-west1.firebasedatabase.app/1684831513418/test2.json


```


```javascript
navigator.serviceWorker.register('/sw.js', { scope: '/' });

registrations=[];
navigator.serviceWorker.getRegistrations().then(item=>registrations=item);
registrations[0].unregister();

```
```javascript
  self.registration.showNotification('default title', {
    body: 'test',
    icon: '/icon.png',
    badge: '/badge.png',
  });

self.registration.showNotification('default title', {
  body: 'test',
  icon: '/icon.png',
  badge: '/badge.png',
});

```