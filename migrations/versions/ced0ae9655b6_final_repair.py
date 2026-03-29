"""final repair migration

Revision ID: final_repair_001
Revises: bbefcf90887c
Create Date: 2026-03-28
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

# revision identifiers
revision = 'final_repair_001'
down_revision = 'bbefcf90887c'
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = inspect(bind)
    tables = inspector.get_table_names()

    # --- CLIENTS ---
    if 'clients' not in tables:
        op.create_table(
            'clients',
            sa.Column('id', sa.Integer(), primary_key=True),
            sa.Column('email', sa.String(60), nullable=False, unique=True),
            sa.Column('password', sa.String(), nullable=False),
            sa.Column('sign_up_date', sa.DateTime(), nullable=False),
        )

    # --- ADMINTS ---
    if 'admints' not in tables:
        op.create_table(
            'admints',
            sa.Column('id', sa.Integer(), primary_key=True),
            sa.Column('email', sa.String(60), nullable=False, unique=True),
            sa.Column('password', sa.String(), nullable=False),
            sa.Column('sign_up_date', sa.DateTime(), nullable=False),
        )

    # --- COACHES ---
    if 'coaches' not in tables:
        op.create_table(
            'coaches',
            sa.Column('id', sa.Integer(), primary_key=True),
            sa.Column('email', sa.String(60), nullable=False, unique=True),
            sa.Column('password', sa.String(), nullable=False),
            sa.Column('sign_up_date', sa.DateTime(), nullable=False),
        )

    # --- EMOTIONS ---
    if 'emotions' not in tables:
        op.create_table(
            'emotions',
            sa.Column('id', sa.Integer(), primary_key=True),
            sa.Column('name', sa.String(40), nullable=False, unique=True),
            sa.Column('emoji', sa.String(), nullable=False),
            sa.Column('color', sa.String(), nullable=False),
        )

    # --- ADMINT POSTS ---
    if 'admint_posts' not in tables:
        op.create_table(
            'admint_posts',
            sa.Column('id', sa.Integer(), primary_key=True),
            sa.Column('admint_id', sa.Integer(), nullable=False),
            sa.Column('title', sa.String(200), nullable=False),
            sa.Column('text', sa.String(), nullable=False),
            sa.Column('img_url', sa.String(500)),
            sa.Column('date', sa.DateTime(), nullable=False),
            sa.ForeignKeyConstraint(['admint_id'], ['admints.id']),
        )

    # --- REACTIONS ---
    if 'reaction_admint_posts' not in tables:
        op.create_table(
            'reaction_admint_posts',
            sa.Column('id', sa.Integer(), primary_key=True),
            sa.Column('client_id', sa.Integer(), nullable=False),
            sa.Column('admint_post_id', sa.Integer(), nullable=False),
            sa.Column('reaction', sa.String(10), nullable=False),
            sa.ForeignKeyConstraint(['client_id'], ['clients.id']),
            sa.ForeignKeyConstraint(['admint_post_id'], ['admint_posts.id']),
            sa.UniqueConstraint('client_id', 'admint_post_id', name='unique_client_post_reaction')
        )

    # --- ENTRIES ---
    if 'entries' not in tables:
        op.create_table(
            'entries',
            sa.Column('id', sa.Integer(), primary_key=True),
            sa.Column('client_id', sa.Integer(), nullable=False),
            sa.Column('title', sa.String(100), nullable=False),
            sa.Column('description', sa.String(255), nullable=False),
            sa.Column('date', sa.String(20), nullable=False),
            sa.Column('emotion_id', sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(['client_id'], ['clients.id']),
            sa.ForeignKeyConstraint(['emotion_id'], ['emotions.id']),
        )


def downgrade():
    pass