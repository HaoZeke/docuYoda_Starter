#!/bin/bash

set -o errexit -o nounset

rev=$(git rev-parse --short HEAD)

cd sap/pdf
#rm -rf .git

git init
git config user.name "HaoZeke"
git config user.email "rohit.goswami@aol.com"

git remote add upstream "git@github.com:HaoZeke/docuYoda_Starter.git"
git fetch upstream
git reset upstream

touch .

git add -A .
git commit -m "Semaphore rebuilt the pdf at ${rev} [ci skip]"
git push -q upstream HEAD