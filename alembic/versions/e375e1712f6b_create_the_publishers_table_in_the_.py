"""create the publishers table in the database-2

Revision ID: e375e1712f6b
Revises: bc280c2ddf16
Create Date: 2025-08-22 17:50:27.963463

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e375e1712f6b'
down_revision: Union[str, None] = 'bc280c2ddf16'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
