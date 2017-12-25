#!/bin/bash

set -o errexit -o nounset

rev=$(git rev-parse --short HEAD)

cd sap/pdf
#rm -rf .git

git init
git config user.name "HaoZeke"
git config user.email "rohit@myarchbox.com"

git remote add upstream "git@bitbucket.org:HaoZeke/CommaCentral.git"
git fetch upstream
git reset upstream/pdf

touch .

git add -A .
git commit -m "Wercker rebuilt the pdf at ${rev}"
git push -q upstream HEAD:pdf