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

  DATA_TIMETABLE='
  {
    "to": "'$FCM_TOKEN'",
    "notification": {
      "title": "Timetable change",
      "body": "Your UvA timetable has been changed, check the updated timetable",
      "click_action": "http://localhost:3000/rooster?timetableId=00f018dd-ce5f-49b7-976e-0394d23928b1",
      "icon": "fcm_push_icon.png"
    },
    "priority": 10
  }
  '


  DATA_GRADE_OLD='
  {
    "to": "'$FCM_TOKEN'",
    "notification": {
      "title": "Grade update",
      "body": "Your UvA grade has been updated, check the updated grade",
      "click_action": "https://student-dev.ic.uva.nl/en/study-results?gradeId=178091-99999GG3Y",
      "icon": "fcm_push_icon.png"
    },
    "priority": 10
  }
  '
  DATA_GRADE_NEW='
  {
    "to": "'$FCM_TOKEN'",
    "data": {
      "title": "New grade",
      "body": "A new grade has been registered in SIS.",
      "link":"https://student-dev.ic.uva.nl/en/study-results?gradeId=178091-99999GG3Y"
    },
    "priority": 10
  }
  '
#    "data": {
#      "title": "Grade update",
#      "body": "Your UvA grade has been updated, check the updated grade",
#      "link":"http://localhost:3000/en/study-results?gradeId=178091-99999GG3Y"
#    },
#    "webpush": {
#      "fcm_options": {
#        "link": "/en/study-results?gradeId=178091-99999GG3Y"
#      }
#    },

  # DATA=$DATA_TIMETABLE
  #DATA=$DATA_GRADE_OLD
  DATA=$DATA_GRADE_NEW

  printf "$DESCRIPTION : "

  curl --request POST                                         \
      --header 'Authorization: key='$SERVER_KEY               \
      --Header 'Content-Type: application/json'               \
      --data   ${DATA/DATE/$(date -u +"%Y-%m-%dT%H:%M:%SZ")}  \
      https://fcm.googleapis.com/fcm/send
}

#send-push-web    'TEST' 'cajkhS0fK7sUQqw6EvnutX:APA91bHOSw7wDlI_6RfKphS30dYnh2LgBr2Joz8zw5dL54IcNysaebNyyFHX40tKd79mXtvUUXyxyZrSGcteeV0whM8g6FxzhEBfSPOFKK8HFSFPOTUgjcZg1EuDIYD9Nf4q0QcbBBNr'
#send-push-web    'TEST' 'dRFRFFisYNTsG2nV81zKJW:APA91bGoZEnLQT0tnMA4BXQkK0LyXJx1bT1YAe6LR9uNw2styyiuUN6mUai7nbC04Oe-VAdxE790JrMg8tRm9MSUGRvaCrjsCeLAz8m1H9lMCrcg_O6kM1LS3hlBkZ6LTo6GR9Kwzdzm'

send-push-web    'TEST' 'eAZ_1kXZiHJyplcK5avjQo:APA91bFUnjWj03bSLz8kKkq5jxJZKEpsBEh6L6p15fShqtE0HlvwjHTd-m-Y1MLyag1Z4HoTNyNrHp_uoKJ9NlncpR2IQKEuI0Y0aaV5Dnw_kl8k9icj6Fz3iXRbHqYSoH88OqNMzjjL'
