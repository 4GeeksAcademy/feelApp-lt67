#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

pip install pipenv

pipenv install

pipenv run python reset_db.py

pipenv run flask db stamp head || true

pipenv run flask db upgrade
