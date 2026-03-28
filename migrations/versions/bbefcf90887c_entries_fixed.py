"""entries fixed

Revision ID: bbefcf90887c
Revises: c9a87a16238b
Create Date: 2026-03-28 23:01:46.663462
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'bbefcf90887c'
down_revision = 'c9a87a16238b'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'entries',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('client_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=100), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=False),
        sa.Column('date', sa.String(length=20), nullable=False),
        sa.Column('emotion_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['client_id'], ['clients.id']),
        sa.ForeignKeyConstraint(['emotion_id'], ['emotions.id']),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('entries')