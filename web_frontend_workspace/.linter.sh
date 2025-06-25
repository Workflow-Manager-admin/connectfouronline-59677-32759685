#!/bin/bash
cd /home/kavia/workspace/code-generation/connectfouronline-59677-32759685/web_frontend_workspace/web_frontend
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

