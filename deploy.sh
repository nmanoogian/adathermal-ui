#!/bin/bash
yarn build
rsync -av --delete build/ root@raspberrypi:/var/www/html/
