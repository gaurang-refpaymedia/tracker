"""create the publishers table in the database

Revision ID: b48e5ded4437
Revises: e1eb6a3d2ba9
Create Date: 2025-08-22 17:18:24.247954

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b48e5ded4437'
down_revision: Union[str, None] = 'e1eb6a3d2ba9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
