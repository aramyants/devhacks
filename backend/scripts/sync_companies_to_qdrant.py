import os
from database import SessionLocal
from models import Company  # your SQLAlchemy ORM model for companies
from qdrant_client import QdrantClient
from qdrant_client.http import models as rest
from openai import OpenAI

# Initialize OpenAI client with your API key
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

client = QdrantClient(host="localhost", port=6333)
COLLECTION_NAME = "companies"

def embed(text: str):
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def sync_companies():
    with SessionLocal() as db:
        companies = db.query(Company).all()
        points = []
        for company in companies:
            vector = embed(company.details)
            points.append(
                rest.PointStruct(
                    id=company.id,
                    vector=vector,
                    payload={
                        "name": company.name,
                        "details": company.details
                    }
                )
            )

        if points:
            # (Re)create collection — careful, this deletes existing data!
            client.recreate_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=rest.VectorParams(size=1536, distance=rest.Distance.COSINE)
            )
            client.upsert(collection_name=COLLECTION_NAME, points=points)
            print(f"Synced {len(points)} companies to Qdrant.")
        else:
            print("No companies found to sync.")

if __name__ == "__main__":
    sync_companies()
