"""initial

Revision ID: a25afdfeb41e
Revises: 
Create Date: 2026-03-29 02:54:41.435678

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = 'a25afdfeb41e'
down_revision = None
branch_labels = None
depends_on = None


# reset de miraciones para resolver el problema de migraciones fantasma y choque entre migraciones pasadas
# cuando hice esta migracion alembic la hizo al reves, borrando todas las tablas y tuve que cambiarlo

def upgrade():
    op.create_table('admints',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=60), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('sign_up_date', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('coaches',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=60), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('sign_up_date', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('emotions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=40), nullable=False),
    sa.Column('emoji', sa.String(), nullable=False),
    sa.Column('color', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('clients',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=60), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('sign_up_date', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('admint_posts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('admint_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('text', sa.String(), nullable=False),
    sa.Column('img_url', sa.String(length=500), nullable=True),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['admint_id'], ['admints.id']),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('entries',
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
    op.create_table('reaction_admint_posts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('client_id', sa.Integer(), nullable=False),
    sa.Column('admint_post_id', sa.Integer(), nullable=False),
    sa.Column('reaction', sa.String(length=10), nullable=False),
    sa.ForeignKeyConstraint(['admint_post_id'], ['admint_posts.id']),
    sa.ForeignKeyConstraint(['client_id'], ['clients.id']),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('client_id', 'admint_post_id', name='unique_client_post_reaction')
    )
    op.create_table('client_favorites',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('client_id', sa.Integer(), nullable=False),
    sa.Column('entry_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['client_id'], ['clients.id']),
    sa.ForeignKeyConstraint(['entry_id'], ['entries.id']),
    sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('client_favorites')
    op.drop_table('reaction_admint_posts')
    op.drop_table('entries')
    op.drop_table('admint_posts')
    op.drop_table('clients')
    op.drop_table('emotions')
    op.drop_table('coaches')
    op.drop_table('admints')