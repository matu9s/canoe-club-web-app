"""Fix boat model

Revision ID: 27af7615b639
Revises: 758fa8a68445
Create Date: 2023-04-07 11:30:43.970502

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '27af7615b639'
down_revision = '758fa8a68445'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('boat', schema=None) as batch_op:
        batch_op.add_column(sa.Column('model', sa.String(length=30), nullable=True))
        batch_op.drop_column('category')
        batch_op.drop_column('gender')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('boat', schema=None) as batch_op:
        batch_op.add_column(sa.Column('gender', mysql.ENUM('MALE', 'FEMALE'), nullable=True))
        batch_op.add_column(sa.Column('category', mysql.ENUM('CHILDREN', 'JUNIORS', 'CADETS', 'SENIORS', 'VETERANS'), nullable=True))
        batch_op.drop_column('model')

    # ### end Alembic commands ###