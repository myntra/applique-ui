#!/usr/bin/env bash

REMOTE_BRANCH=$(git rev-parse --abbrev-ref --symbolic-full-name "@{u}" 2> /dev/null)

echo ${REMOTE_BRANCH:-master}
