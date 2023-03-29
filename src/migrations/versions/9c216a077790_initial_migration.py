"""Initial migration.

Revision ID: 9c216a077790
Revises: 
Create Date: 2023-03-28 16:06:16.644263

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9c216a077790'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('account',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=30), nullable=False),
    sa.Column('password', sa.String(length=30), nullable=True),
    sa.Column('salt', sa.String(length=30), nullable=True),
    sa.Column('name', sa.String(length=30), nullable=True),
    sa.Column('surname', sa.String(length=30), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('role',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('type', sa.Enum('TRAINER', 'MEMBER', 'MECHANIC', 'ADMIN', name='roletype'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('account_role',
    sa.Column('account_id', sa.Integer(), nullable=False),
    sa.Column('role_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['account_id'], ['account.id'], ),
    sa.ForeignKeyConstraint(['role_id'], ['role.id'], ),
    sa.PrimaryKeyConstraint('account_id', 'role_id')
    )
    op.create_table('boat',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('year_of_production', sa.Integer(), nullable=True),
    sa.Column('size', sa.Enum('S', 'M', 'L', 'XL', name='boatsize'), nullable=True),
    sa.Column('mini', sa.Boolean(), nullable=True),
    sa.Column('defect', sa.String(length=280), nullable=True),
    sa.Column('gender', sa.Enum('MALE', 'FEMALE', name='gender'), nullable=True),
    sa.Column('category', sa.Enum('CHILDREN', 'JUNIORS', 'CADETS', 'SENIORS', 'VETERANS', name='agecategory'), nullable=True),
    sa.Column('kayak_canoe', sa.Enum('KAYAK', 'CANOE', name='kayakcanoe'), nullable=True),
    sa.Column('account_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['account_id'], ['account.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('member',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('age', sa.Integer(), nullable=True),
    sa.Column('height', sa.Integer(), nullable=True),
    sa.Column('weight', sa.Integer(), nullable=True),
    sa.Column('gender', sa.Enum('MALE', 'FEMALE', name='gender'), nullable=True),
    sa.Column('category', sa.Enum('CHILDREN', 'JUNIORS', 'CADETS', 'SENIORS', 'VETERANS', name='agecategory'), nullable=True),
    sa.Column('kayak_canoe', sa.Enum('KAYAK', 'CANOE', name='kayakcanoe'), nullable=True),
    sa.Column('membership_fee', sa.Float(), nullable=True),
    sa.Column('account_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['account_id'], ['account.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('training',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('place', sa.String(length=30), nullable=True),
    sa.Column('date_time', sa.DateTime(), nullable=True),
    sa.Column('type', sa.Enum('WATER', 'OUTSIDE', 'SWIMMING', 'GYM', 'ERGOMETERS', name='trainingtype'), nullable=True),
    sa.Column('account_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['account_id'], ['account.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('training_member',
    sa.Column('training_id', sa.Integer(), nullable=False),
    sa.Column('member_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['member_id'], ['member.id'], ),
    sa.ForeignKeyConstraint(['training_id'], ['training.id'], ),
    sa.PrimaryKeyConstraint('training_id', 'member_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('training_member')
    op.drop_table('training')
    op.drop_table('member')
    op.drop_table('boat')
    op.drop_table('account_role')
    op.drop_table('role')
    op.drop_table('account')
    # ### end Alembic commands ###
