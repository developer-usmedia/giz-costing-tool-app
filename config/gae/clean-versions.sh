#!/bin/bash
# See: https://almcc.me/blog/2017/05/04/removing-older-versions-on-google-app-engine/

VERSIONS=$(gcloud app versions list --project=${GOOGLE_CLOUD_PROJECT} --service default --filter='traffic_split=0' --sort-by '~version.createTime' --format 'value(version.id)')
COUNT=0
echo "Cleanup of old versions"
for VERSION in ${VERSIONS}
do
    ((COUNT++))
    if [ $COUNT -gt 10 ]
    then
      echo "Delete version '${VERSION}' of '${GOOGLE_CLOUD_PROJECT}'."
      gcloud app versions delete ${VERSION} --service default --project=${GOOGLE_CLOUD_PROJECT} --quiet
    else
      echo "Keep version '${VERSION}' of '${GOOGLE_CLOUD_PROJECT}'."
    fi
done
