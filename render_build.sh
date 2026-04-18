#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

pip install pipenv

pipenv install

pipenv run flask db stamp head

pipenv run flask db upgrade
#!/usr/bin/env bash
set -o errexit


