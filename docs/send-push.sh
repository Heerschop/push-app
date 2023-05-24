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

#send-push-web    'TEST' 'cu5YUh07uOrF9TxkYBhYGB:APA91bEO68xuRf4Q7j_Thmj8hXY0XkpUZXnLzZKzhVe2PfNa0CQQSzCPUMVunnjnTF-Nj6KmONmCkPK5O5ACtPMW_DLI0DiwhIOPAd9zHrFAt2exEllBwWsLrRGgv0zixTgIALfCqM6M'
send-push-web    'TEST' 'cajkhS0fK7sUQqw6EvnutX:APA91bE0Yg9c3ckcnaJysoJcPvcMwJXnbsvXbJeBFNfmPJ55b5K6HfIZSfl2EqiHFzGGXKwX-b0S6R29cumoCykeQONDol6ZmndhBWKiZDpTu5O88MjZV-A1eTNkAMxAiXrRWmWWhAdY'

#send-push-web    'TEST' 'fwvZP2rBwgZxcVz240Aur_:APA91bEA7TG2kvhSl_mzV3n03IfZeAV_zwt9LpFpTeJ58WrvcCsTPzWL5bCao68ffLmW-GHtwMVF3oJWyjbdQ8NGTI6MEJUDgcwyj86BnLlq-l45yzh9XTzg3Bu5xuCAXYZWNSVROFNT'
