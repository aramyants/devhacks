
"""Remove unused columns from companies table

Revision ID: e5a6e60c0c4f
Revises: be84e49e14cf
Create Date: 2025-07-05 13:34:05.176354+00:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e5a6e60c0c4f'
down_revision = 'be84e49e14cf'
branch_labels = None
depends_on = None

def upgrade():
    # Drop unwanted columns
    with op.batch_alter_table('companies') as batch_op:
        batch_op.drop_column('industry')
        batch_op.drop_column('website')
        batch_op.drop_column('logo')
        batch_op.drop_column('tagline')
        batch_op.drop_column('mission')
        batch_op.drop_column('vision')
        batch_op.drop_column('values')
        batch_op.drop_column('founded_year')
        batch_op.drop_column('size')
        batch_op.drop_column('country')
        batch_op.drop_column('city')
        batch_op.drop_column('contact_email')
        batch_op.drop_column('phone')
        batch_op.drop_column('social_links')
        batch_op.drop_column('extra')


def downgrade():
    # Re-add columns if needed during rollback
    with op.batch_alter_table('companies') as batch_op:
        batch_op.add_column(sa.Column('industry', sa.String(length=128)))
        batch_op.add_column(sa.Column('website', sa.String(length=255)))
        batch_op.add_column(sa.Column('logo', sa.String(length=255)))
        batch_op.add_column(sa.Column('tagline', sa.String(length=255)))
        batch_op.add_column(sa.Column('mission', sa.Text()))
        batch_op.add_column(sa.Column('vision', sa.Text()))
        batch_op.add_column(sa.Column('values', sa.String(length=255)))
        batch_op.add_column(sa.Column('founded_year', sa.Integer()))
        batch_op.add_column(sa.Column('size', sa.String(length=64)))
        batch_op.add_column(sa.Column('country', sa.String(length=64)))
        batch_op.add_column(sa.Column('city', sa.String(length=64)))
        batch_op.add_column(sa.Column('contact_email', sa.String(length=255)))
        batch_op.add_column(sa.Column('phone', sa.String(length=64)))
        batch_op.add_column(sa.Column('social_links', sa.JSON()))
        batch_op.add_column(sa.Column('extra', sa.JSON()))

