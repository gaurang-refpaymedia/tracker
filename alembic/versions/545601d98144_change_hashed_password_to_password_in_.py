"""change hashed_password to password in models

Revision ID: 545601d98144
Revises: 08b144ecf17b
Create Date: 2025-08-05 11:17:31.533021

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '545601d98144'
down_revision: Union[str, None] = '08b144ecf17b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
