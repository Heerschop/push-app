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
      "link":"https://uva-push-app.web.app/pages/push/index.html?gradeId=178091-99999GG3Y"
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
#send-push-web    'iphone-oke' 'frEZqxS-2vU8iPcen5qsm_:APA91bFQ84xCxph9MD2DRfWyWsyqxcdKYlHgS1vgETNHtKiSX_bi6Tprh6Ujp8AzZXcwpTLSHZrobk4HGWR7Xtef1bwIHTfveIPNWaO1iM4Zx8CIyQRlo6qaKBIngmpDsk8kGzf6-Jqn'

send-push-web    'test' 'fMhelqeoPtYLUr1uKGUMbA:APA91bGAR8r6xediedxfhaGYvkPEf0wVi3lR60JpFC8UT8CMhgV_l10EeqTHkJ0CfZSP03iF-e_LPCZXQT-mEpvCl6H0WUVu9rhWbU1BYiTd3QgQxKK1ZHF6kwluJY8iVV9YcntpUtqE'
#send-push-web    'iphone' 'frJ-TwcvHn6x4lLR70aesZ:APA91bE-7WRcsMQRrN9e4k7-6-Nd-qftzF1qV7oPo1ZPBAjairXWpd2tQhHiUKWdZ4kwJHzRtNFQvlwU55qobwVt9DLNmbvKneR1KBeDqErNG1UD6KL1MNu2-r_6VyXvdYlUNXqnLZBR'


#send-push-web    'macintosh' 'cajkhS0fK7sUQqw6EvnutX:APA91bHOSw7wDlI_6RfKphS30dYnh2LgBr2Joz8zw5dL54IcNysaebNyyFHX40tKd79mXtvUUXyxyZrSGcteeV0whM8g6FxzhEBfSPOFKK8HFSFPOTUgjcZg1EuDIYD9Nf4q0QcbBBNr'
