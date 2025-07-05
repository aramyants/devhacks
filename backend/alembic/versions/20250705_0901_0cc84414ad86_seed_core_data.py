
"""seed core data

Revision ID: 0cc84414ad86
Revises: 2522b70097b6
Create Date: 2025-07-05 09:01:24.041108+00:00

"""
from datetime import datetime
from decimal import Decimal
from alembic import op
import sqlalchemy as sa

ROLE_ADMIN = "admin"
ROLE_USER  = "user"
TYPE_SERVICE = "service"

# revision identifiers, used by Alembic.
revision = '0cc84414ad86'
down_revision = '2522b70097b6'
branch_labels = None
depends_on = None

def upgrade() -> None:
    conn = op.get_bind()
    now  = datetime.utcnow()

    # Platform tenant + super-admin
    platform_id = conn.execute(
        sa.text(
            """
            INSERT INTO companies (name, industry, website, tagline, created_at)
            VALUES ('Platform', 'Internal', 'https://platform.local',
                    'Internal system tenant', :ts)
            RETURNING id
            """
        ),
        {"ts": now},
    ).scalar_one()

    conn.execute(
        sa.text(
            """
            INSERT INTO users
              (company_id, email, password_hash, role, created_at)
            VALUES
              (:cid, 'superadmin@example.com',
               '$2b$12$QEbMv.jDw0X8M2c/8C1I5ex9znAy0lP3JzqFZqT1k4bH3gMtOgd8K',
               :role, :ts)
            """
        ),
        {"cid": platform_id, "role": ROLE_ADMIN, "ts": now},
    )

    # Demo companies
    demos = [
        {
            "name": "Acme Inc.",
            "industry": "Manufacturing",
            "website": "https://acme.test",
            "tagline": "Rocket-speed innovation",
            "user_email": "jane.doe@acme.test",
        },
        {
            "name": "Globex LLC",
            "industry": "Software",
            "website": "https://globex.test",
            "tagline": "Scale without limits",
            "user_email": "john.smith@globex.test",
        },
    ]

    for d in demos:
        company_id = conn.execute(
            sa.text(
                """
                INSERT INTO companies (name,industry,website,tagline,created_at)
                VALUES (:name,:industry,:website,:tagline,:ts)
                RETURNING id
                """
            ),
            {**d, "ts": now},
        ).scalar_one()

        conn.execute(
            sa.text(
                """
                INSERT INTO users
                  (company_id,email,password_hash,role,created_at)
                VALUES
                  (:cid,:email,
                   '$2b$12$q9uEA8DEH5.Z/HXXIQK5gepG9e31lZJyt7YwrJv7OZaQcPlW4ITEa',
                   :role,:ts)
                """
            ),
            {"cid": company_id, "email": d["user_email"], "role": ROLE_USER, "ts": now},
        )

        conn.execute(
            sa.text(
                """
                INSERT INTO products
                  (company_id,name,description,price,stock_qty,created_at)
                VALUES
                  (:cid,:pname,:pdesc,:price,100,:ts)
                """
            ),
            {
                "cid":   company_id,
                "pname": f"{d['name']} Starter Kit",
                "pdesc": f"Flagship product by {d['name']}.",
                "price": Decimal("99.99"),
                "ts":    now,
            },
        )

        conn.execute(
            sa.text(
                """
                INSERT INTO offerings
                  (company_id,name,type,description,price,currency,created_at)
                VALUES
                  (:cid,:oname,:otype,
                   'Priority assistance and consulting.', :price,'USD',:ts)
                """
            ),
            {
                "cid":   company_id,
                "oname": f"{d['name']} Premium Support",
                "otype": TYPE_SERVICE,
                "price": Decimal("499.00"),
                "ts":    now,
            },
        )


def downgrade() -> None:
    conn = op.get_bind()
    conn.execute(sa.text("DELETE FROM offerings WHERE name LIKE '%Premium Support'"))
    conn.execute(sa.text("DELETE FROM products  WHERE name LIKE '%Starter Kit'"))
    conn.execute(
        sa.text(
            "DELETE FROM users WHERE email IN "
            "('jane.doe@acme.test','john.smith@globex.test','superadmin@example.com')"
        )
    )
    conn.execute(sa.text("DELETE FROM companies WHERE name IN ('Platform','Acme Inc.','Globex LLC')"))
