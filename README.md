# Test Push App

### Deploy site react

```bash
npx firebase login

npm run build && npx firebase deploy --only hosting:react

```

### Deploy site native

```bash
npx firebase login

npx firebase deploy --only hosting:native
```

```bash
(cd native && npx lite-server)
```


https://uva-push-app.web.app/