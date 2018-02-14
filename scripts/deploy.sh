#!/bin/bash

set -o errexit -o nounset

rev=$(git rev-parse --short HEAD)

cd sap/pdf
#rm -rf .git

git init
git config user.name "HaoZeke"
git config user.email "rohit.goswami@aol.com"

git remote add upstream "git@github.com:HaoZeke/docuYoda_Starter.git"
git fetch --all

touch .

git add -A .
git commit -m "Semaphore rebuilt the pdf at ${rev}"
git merge upstream/pdf --allow-unrelated-histories --no-edit
#git reset upstream/pdf
git push -q upstream HEAD:pdf 