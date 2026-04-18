#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

pip install pipenv
pipenv install

export PYTHONPATH=$PYTHONPATH:$(pwd)/src
export FLASK_APP=src/app.py

pipenv run python -c "from app import app; from api.models import db; app.app_context().push(); db.session.execute(db.text('DROP TABLE IF EXISTS alembic_version CASCADE')); db.session.commit()"

pipenv run flask db upgrade
