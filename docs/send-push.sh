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

#send-push-web    'linux' 'fggF0vgLrwU-BlZkV9KNP1:APA91bFq5yhUo3oEeWW-wQUs3g22NcbOvUw2vIgbzVIkF5oRqbH1_iMKGu5O5eUBCP_4EOWomzVMYB2jeNDUP65-HFvNH_JQXQY4IIZbIvlLPr0nGaI54nkU_t6ocyeFD_j64ii4veR_'
#send-push-web    'iphone-oke' 'c3B0VO9HryH6aDk2W9oWvM:APA91bFHv-EkhTY5RphuM_lfU2a12g6TPN77hGYwj18fAFxYT6PIPIvTR1r0BS3onK5SFr-UvphT_-GvfrlJf4fqGbdUAFrfjxU6oFrw4yXJ-Rr0dWo1o4G2hglXnFFFkA9W1LMtBPj0'
send-push-web    'iphone-err' 'dyGDbD1cE4dGI8n0fEJ6PB:APA91bFmJKiEzhYzbkSMXi3f2IfuurHmU8LzMlA33rvJWUji93azRboRsWO9-9DiAwj4tORYJFW7rX3AJczS-nfFOHoCjQIZNf0Zs3z-6qLV3GdoajTUHHjDEwpGsIAtT50N5ueVqRrU'
#send-push-web    'android' 'dR-r80Qnls0puy370UTU48:APA91bG6eknFj04q0FRWvpLYCKUqOshFv0K9IDPsUkOcK-cUefyqAy2leMrSxN_cxuaDB4I-w1NKZ8PJonJSwges9gwCvZvDL1uX1udrwjLrmhSHhUCntotHoclEdlph-Fxwor0t8nGT'


#send-push-web    'macintosh' 'cajkhS0fK7sUQqw6EvnutX:APA91bHOSw7wDlI_6RfKphS30dYnh2LgBr2Joz8zw5dL54IcNysaebNyyFHX40tKd79mXtvUUXyxyZrSGcteeV0whM8g6FxzhEBfSPOFKK8HFSFPOTUgjcZg1EuDIYD9Nf4q0QcbBBNr'
