
"""add vardanants demo company

Revision ID: b52a26b52ff2
Revises: 0cc84414ad86
Create Date: 2025-07-05 09:16:35.010691+00:00

"""
from datetime import datetime
from decimal import Decimal
from alembic import op
import sqlalchemy as sa

ROLE_USER    = "user"
TYPE_SERVICE = "service"

# revision identifiers, used by Alembic.
revision = 'b52a26b52ff2'
down_revision = '0cc84414ad86'
branch_labels = None
depends_on = None

def upgrade() -> None:
    conn = op.get_bind()
    now  = datetime.utcnow()

    # 1️⃣ Company row (Armenian fields)
    company_id = conn.execute(
        sa.text(
            """
            INSERT INTO companies
              (name, industry, website, tagline, country, city, created_at)
            VALUES
              (:name, :industry, :website, :tagline, 'Armenia', 'Երևան', :ts)
            RETURNING id
            """
        ),
        {
            "name":     "Վարդանանց Նորարար Բժշկության Կենտրոն",
            "industry": "Բժշկություն",
            "website":  "https://vardanants.am/hy",
            "tagline":  "Նորարար բժշկություն՝ հոգատարություն ամեն փուլում",
            "ts":       now,
        },
    ).scalar_one()

    # 2️⃣ Normal user for that tenant
    conn.execute(
        sa.text(
            """
            INSERT INTO users
              (company_id, email, password_hash, role, created_at)
            VALUES
              (:cid, :email,
               '$2b$12$q9uEA8DEH5.Z/HXXIQK5gepG9e31lZJyt7YwrJv7OZaQcPlW4ITEa',
               :role, :ts)
            """
        ),
        {
            "cid":   company_id,
            "email": "info@vardanants.am",
            "role":  ROLE_USER,
            "ts":    now,
        },
    )

    # 3️⃣ One product
    conn.execute(
        sa.text(
            """
            INSERT INTO products
              (company_id, name, description, price, stock_qty, created_at)
            VALUES
              (:cid, :name, :desc, :price, 100, :ts)
            """
        ),
        {
            "cid":  company_id,
            "name": "Ընդհանուր բուժզննում",
            "desc": "Լրիվ սքրինինգ և արյան անալիզներ մեկ այցով։",
            "price": Decimal("15000.00"),
            "ts":    now,
        },
    )

    # 4️⃣ One service offering
    conn.execute(
        sa.text(
            """
            INSERT INTO offerings
              (company_id, name, type, description, price, currency, created_at)
            VALUES
              (:cid, :name, :type, :desc, :price, 'AMD', :ts)
            """
        ),
        {
            "cid":  company_id,
            "name": "Վարդանանց Պրեմիում Խնամք",
            "type": TYPE_SERVICE,
            "desc": "Անհատական վերահսկողություն և առաջնահերթ ընդունելություն։",
            "price": Decimal("50000.00"),
            "ts":    now,
        },
    )


def downgrade() -> None:
    conn = op.get_bind()

    # delete child rows first to respect FKs
    conn.execute(
        sa.text("DELETE FROM offerings WHERE name = 'Վարդանանց Պրեմիում Խնամք'")
    )
    conn.execute(
        sa.text("DELETE FROM products  WHERE name = 'Ընդհանուր բուժզննում'")
    )
    conn.execute(
        sa.text("DELETE FROM users     WHERE email = 'info@vardanants.am'")
    )
    conn.execute(
        sa.text(
            "DELETE FROM companies WHERE name = 'Վարդանանց Նորարար Բժշկության Կենտրոն'"
        )
    )
