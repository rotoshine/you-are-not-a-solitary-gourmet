#!/bin/sh

curl -X POST -H 'Content-type: application/json' --data '{"text":"안고미 배포 완료!", "channel":"#angomi-dev"}' $REACT_APP_SLACK_HOOK