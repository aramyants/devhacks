from models import Company
from database import SessionLocal

# Dummy companies for universal test coverage
companies = [
    Company(
        name="Acme Medical",
        details="Leading provider of medical devices.",
        industry="Medical",
        website="https://acmemedical.com",
        logo="https://placehold.co/80x80/5f6fff/fff?text=Acme",
        tagline="Innovating Health",
        mission="To improve lives through innovation.",
        vision="A healthier world for all.",
        values="Innovation, Compassion, Trust",
        founded_year=2001,
        size="201-500",
        country="USA",
        city="Boston",
        contact_email="info@acmemedical.com",
        phone="+1-555-1234",
        social_links={"linkedin": "https://linkedin.com/acmemedical"},
        extra={"certifications": ["ISO 9001", "FDA"]},
    ),
    Company(
        name="Globex Marketing",
        details="Full-service marketing agency.",
        industry="Marketing",
        website="https://globexmarketing.com",
        logo="https://placehold.co/80x80/e67e22/fff?text=Globex",
        tagline="Grow with Globex",
        mission="Empowering brands to reach new heights.",
        vision="To be the world's most creative agency.",
        values="Creativity, Results, Partnership",
        founded_year=2010,
        size="51-200",
        country="UK",
        city="London",
        contact_email="hello@globexmarketing.com",
        phone="+44-20-1234-5678",
        social_links={"twitter": "https://twitter.com/globex"},
        extra={"awards": ["Best Agency 2023"]},
    ),
    Company(
        name="NextGen SaaS",
        details="Cloud-based productivity tools.",
        industry="SaaS",
        website="https://nextgensaas.com",
        logo="https://placehold.co/80x80/27ae60/fff?text=NextGen",
        tagline="Work Smarter, Not Harder",
        mission="To simplify work for everyone.",
        vision="A world where work is effortless.",
        values="Simplicity, Security, Support",
        founded_year=2018,
        size="11-50",
        country="Germany",
        city="Berlin",
        contact_email="contact@nextgensaas.com",
        phone="+49-30-9876-5432",
        social_links={"facebook": "https://facebook.com/nextgensaas"},
        extra={"integrations": ["Slack", "Google Workspace"]},
    ),
]

def seed_companies():
    db = SessionLocal()
    for c in companies:
        exists = db.query(Company).filter_by(name=c.name).first()
        if not exists:
            db.add(c)
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_companies()
    print("Seeded universal test companies.")
