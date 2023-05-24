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

#send-push-web    'linux' 'dRFRFFisYNTsG2nV81zKJW:APA91bGuxpmsepPf19BxD4NcKyRa5_RTTeyCGlPdUTsBPStZ-lzxOkW4gKRozVdQLFM7hWMqJMWlOv6Bice_yF_Q8YPz6hs4Gu4_3Jj5NEQElwW3qRj1hACAqT_w0aTI6LmQPIizxARP'
send-push-web    'iphone-oke' 'c3B0VO9HryH6aDk2W9oWvM:APA91bFHv-EkhTY5RphuM_lfU2a12g6TPN77hGYwj18fAFxYT6PIPIvTR1r0BS3onK5SFr-UvphT_-GvfrlJf4fqGbdUAFrfjxU6oFrw4yXJ-Rr0dWo1o4G2hglXnFFFkA9W1LMtBPj0'
#send-push-web    'iphone-err' 'f2ZQkHfoNADjteSh6XSayA:APA91bEiu2joFUwRFCvO8g4b0BwjYw4ujQ_VMBlM7GPg4Ft4DBLuJIpaKEBdgi90qFRfG9az6SuiadJbk8CsOCdElRA5xxy7q8q5f-qA_NmlWRvtc6chqLCULH835EMTIkgrlDJVm1bi'

#send-push-web    'macintosh' 'cajkhS0fK7sUQqw6EvnutX:APA91bHOSw7wDlI_6RfKphS30dYnh2LgBr2Joz8zw5dL54IcNysaebNyyFHX40tKd79mXtvUUXyxyZrSGcteeV0whM8g6FxzhEBfSPOFKK8HFSFPOTUgjcZg1EuDIYD9Nf4q0QcbBBNr'
