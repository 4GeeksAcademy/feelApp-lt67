#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

pip install pipenv

pipenv install

pipenv run python -c "from src.app import app; from api.models import db; with app.app_context(): db.session.execute('DROP TABLE IF EXISTS alembic_version CASCADE'); db.session.commit(); print('Alembic table dropped')"

pipenv run upgrade
#!/usr/bin/env bash
set -o errexit


