"""create the publishers table in the database-1

Revision ID: bc280c2ddf16
Revises: b48e5ded4437
Create Date: 2025-08-22 17:24:49.262106

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bc280c2ddf16'
down_revision: Union[str, None] = 'b48e5ded4437'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
