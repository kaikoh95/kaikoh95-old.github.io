#!/bin/bash
#
# Automatically adds branch name and branch description to every commit message.
# Modified from the gist here https://gist.github.com/bartoszmajsak/1396344
#

GIT_DIR='.git'
COMMIT_MSG='.git/COMMIT_EDITMSG'

# Succeed on all merge messages, as evidenced by MERGE_MSG existing
[ -f $GIT_DIR/MERGE_MSG ] && exit 0

# Get branch name and description
BRANCH_NAME=$(git branch | grep '*' | sed 's/* //')

BRANCH_NAME_SAFE=${BRANCH_NAME//\//\\/}

# A developer has already prepended the commit in the format [BRANCH_NAME]
BRANCH_IN_COMMIT=$(grep -c "$BRANCH_NAME_SAFE" $COMMIT_MSG)

if [ -n "$BRANCH_NAME_SAFE" ] && ! [[ $BRANCH_IN_COMMIT -ge 1 ]]; then
  sed -i.bak -e "1s/^/[$BRANCH_NAME_SAFE] /" $COMMIT_MSG
fi
