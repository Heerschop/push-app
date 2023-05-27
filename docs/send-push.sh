#!/bin/bash
if [ -z "$SERVER_KEY" ]
then
  read "SERVER_KEY?Firebase server key? "
  export SERVER_KEY=$SERVER_KEY
  echo
  echo
fi


if [ -z "$SERVER_KEY" ]
then
  echo No firebase server key
  echo Usage: . ./send-push.sh
  exit 1
fi

function send-push-web {
  DESCRIPTION=$1
  FCM_TOKEN=$2



  PUSH_DATA='
  {
    "to": "'$FCM_TOKEN'",
    "data": {
      "title": "New grade",
      "body": "A new grade has been registered in SIS.",
      "link":"https://uva-push-app.web.app?gradeId=178091-99999GG3Y"
    },
    "priority": 10
  }
  '

  DATA=$PUSH_DATA

  printf "$DESCRIPTION : "

  curl --request POST                                         \
      --header 'Authorization: key='$SERVER_KEY               \
      --Header 'Content-Type: application/json'               \
      --data   ${DATA/DATE/$(date -u +"%Y-%m-%dT%H:%M:%SZ")}  \
      https://fcm.googleapis.com/fcm/send
}

#send-push-web    'linux' 'cQmfRPL94ChnD0wUxbhRh3:APA91bHbdvmV0i5kYrMXIuCgqa7ab-KR6mFsQAI2GabuY0MVSbCc7Ew9q3nqXol0FyyjXAFIrKgaR4QnUH2gPthy_gdYyu8xtsvhW0SGV9ZYtW_fbf7pXkXWLLTtDANFiIIjmcqA06Kg'
#send-push-web    'iphone-oke' 'cUKGRD7Jik5XTYFSMBcf-y:APA91bH81CVqbTDUoNwDxM1urwrUe1R_r7SiTx0scRyWOMyKu6uLuXVV1BaqFIayL41gh-jyWEIk1br6PVjr889JjahHfaFYzqDWGJ_C4dKkxD00hCvyG5-LNI5-P3gnwXYUUJcrXlPU'

send-push-web    'iphone-err' 'fVZ89yZJXMuiBB3W3b3DOf:APA91bG_JFh_UUF0gzJy0kEWWoKbAx_QGsWy9CfWvu_oqi0bADVDMn_xJDl4idb57WDOFo1q5EhvsAaULwAt1SSuZGXwPw9m40dQMhSKbWeWchHFzDiI3WMqJB51L8Zgp71ewgI7FL87'
#send-push-web    'android' 'dR-r80Qnls0puy370UTU48:APA91bG6eknFj04q0FRWvpLYCKUqOshFv0K9IDPsUkOcK-cUefyqAy2leMrSxN_cxuaDB4I-w1NKZ8PJonJSwges9gwCvZvDL1uX1udrwjLrmhSHhUCntotHoclEdlph-Fxwor0t8nGT'


#send-push-web    'macintosh' 'cajkhS0fK7sUQqw6EvnutX:APA91bHOSw7wDlI_6RfKphS30dYnh2LgBr2Joz8zw5dL54IcNysaebNyyFHX40tKd79mXtvUUXyxyZrSGcteeV0whM8g6FxzhEBfSPOFKK8HFSFPOTUgjcZg1EuDIYD9Nf4q0QcbBBNr'
