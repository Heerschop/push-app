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

#send-push-web    'TEST' 'fMjF0ChudJL4gDjkqXfegP:APA91bF_2JbeHF0yPWvbLqJeERhZBmBZakZlawgJ05SRmcu8WigY9jh-PZhW_7VjkJrdigPMlhX6RbGaYuenR7nvc7wJtZ31Ls3feQVb2Tt5R-LisU100f0fhG18IhM2K1pdsXcXeWzr'
send-push-web    'TEST' 'eIGzBnsF9Qb-M-k0CxTs9K:APA91bFKhdV96PURhiUWmrTACyZyNi78JgKA6YNY5bUla6350akaOzwKAexaGP-4VH8UHEwZJrhu_nvIlD8U52jysb6DMd7io5hSUrZEHfRjWBK1IikG9kC7lHAkjnXaWbln8Lgt8cts'



#send-push-web    'TEST' 'd8OZTb1HDQd0p6duKUgdST:APA91bFp_OvQk1OdhErLb6WbCEGWzkhIqk-KVDdrOW3Tyq8BCoWDw-SA9zsM3VLfDg6dnjMsB_xduNv2A6gnukMvKW7UxiVz30PZjj0Crrb0Jk5iNOwGbzDkIKMuUTjknXDzt8CrDv_B'
