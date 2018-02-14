#!/bin/bash

set -o errexit -o nounset

rev=$(git rev-parse --short HEAD)

cd sap/pdf
if [[ -d ".git" ]]; then
  rm -rf .git
fi

git init
git config user.name "HaoZeke"
git config user.email "rohit.goswami@aol.com"

git remote add upstream "git@github.com:HaoZeke/docuYoda_Starter.git"
git fetch --all
# git reset upstream/pdf

touch .

git add -A .
git commit -m "Semaphore rebuilt the pdf at ${rev}"
git push -q upstream HEAD:pdf --force