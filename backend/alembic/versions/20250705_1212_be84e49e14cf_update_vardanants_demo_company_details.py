"""update vardanants demo company details

Revision ID: be84e49e14cf
Revises: b52a26b52ff2
Create Date: 2025-07-05 12:12:28.944947+00:00

"""
from datetime import datetime
from decimal import Decimal
from alembic import op
import sqlalchemy as sa
import json

TYPE_SERVICE = "service"

# revision identifiers, used by Alembic.
revision = 'be84e49e14cf'
down_revision = 'b52a26b52ff2'
branch_labels = None
depends_on = None

def upgrade() -> None:
    conn = op.get_bind()
    now = datetime.utcnow()
    
    # Get the company_id for Vardanants
    company_id = conn.execute(
        sa.text("SELECT id FROM companies WHERE name = :name"),
        {"name": "Վարդանանց Նորարար Բժշկության Կենտրոն"}
    ).scalar_one()
    
    # Products to insert
    products = [
        {
            "name": "Սիրո քարտ +",
            "description": "Մայրիկների և երեխաների մայրիկների համար նախատեսված առողջական քարտ՝ երկար տարիների առողջ կյանքի համար",
            "price": Decimal("50000.00"),
            "stock_qty": 50,
            "attributes": json.dumps({
                "type": "առողջական_քարտ",
                "target_group": "մայրիկներ",
                "duration": "երկարաժամկետ"
            })
        },
        {
            "name": "Վարդանանց Պրեմիում Խնամք փաթեթ",
            "description": "Անհատական բժշկական փաթեթներ՝ համապարփակ առողջական ծառայությունների համար",
            "price": Decimal("150000.00"),
            "stock_qty": 20,
            "attributes": json.dumps({
                "type": "ծառայությունների_փաթեթ",
                "coverage": "համապարփակ",
                "personalized": True
            })
        },
        {
            "name": "Տնային բուժքույրական ծառայություն",
            "description": "Բուժքույրների կողմից տնային կանչեր և ծառայություններ",
            "price": Decimal("15000.00"),
            "stock_qty": 100,
            "attributes": json.dumps({
                "type": "տնային_ծառայություն",
                "staff": "բուժքույր",
                "location": "տուն"
            })
        }
    ]
    
    # Insert products
    for product in products:
        conn.execute(
            sa.text(
                """
                INSERT INTO products
                  (company_id, name, description, price, stock_qty, attributes, created_at)
                VALUES
                  (:cid, :name, :desc, :price, :stock_qty, :attributes, :ts)
                """
            ),
            {
                "cid": company_id,
                "name": product["name"],
                "desc": product["description"],
                "price": product["price"],
                "stock_qty": product["stock_qty"],
                "attributes": product["attributes"],
                "ts": now,
            },
        )
    
    # Services to insert
    services = [
        {
            "name": "Մամոգրաֆիա",
            "description": "Կրծքագեղձի ամբողջական հետազոտություն մեկ օրում և մեկ վայրում",
            "price": Decimal("25000.00"),
            "attributes": json.dumps({
                "department": "մամոլոգիա",
                "type": "ախտորոշական_հետազոտություն",
                "duration": "1_օր",
                "comprehensive": True
            })
        },
        {
            "name": "Համակարգչային շերտագրում (CT)",
            "description": "SIEMENS Healthineers SOMATOM go. UP համակարգչային շերտագրման վերջին սերնդի սարքով հետազոտություն",
            "price": Decimal("45000.00"),
            "attributes": json.dumps({
                "equipment": "SIEMENS_SOMATOM_go_UP",
                "type": "ճառագայթային_ախտորոշում",
                "technology": "վերջին_սերունդ",
                "low_radiation": True
            })
        },
        {
            "name": "Ցերեկային ստացիոնար",
            "description": "Արդյունավետ բուժում առանց հիվանդանոցում պառկելու",
            "price": Decimal("35000.00"),
            "attributes": json.dumps({
                "type": "ամբուլատոր_բուժում",
                "duration": "ցերեկային",
                "hospitalization": False
            })
        },
        {
            "name": "Մանկաբուժություն",
            "description": "Լաբորատոր և գործիքային հետազոտություններ ամբուլատոր պայմաններում հենց դիմելու օրը",
            "price": Decimal("20000.00"),
            "attributes": json.dumps({
                "department": "մանկաբուժություն",
                "type": "ամբուլատոր_ծառայություն",
                "same_day": True,
                "includes": ["լաբորատոր_հետազոտություն", "գործիքային_հետազոտություն"]
            })
        },
        {
            "name": "Ուրոլոգիական վիրահատություններ",
            "description": "Կանանց անմիզապահությունից մինչև տղամարդու անպտղության բուժում",
            "price": Decimal("250000.00"),
            "attributes": json.dumps({
                "department": "ուրոլոգիա",
                "type": "վիրահատական_միջամտություն",
                "specialist": "բժշկական_գիտությունների_դոկտոր_Երվանդ_Հարությունյան",
                "conditions": ["անմիզապահություն", "անպտղություն"]
            })
        },
        {
            "name": "Կարդիոլոգիական ծառայություններ",
            "description": "Սրտի առողջության երաշխիքներ՝ էլեկտրասրտագրությունից մինչև կորոնարոգրաֆիա և ստենտավորում",
            "price": Decimal("30000.00"),
            "attributes": json.dumps({
                "department": "կարդիոլոգիա",
                "type": "ախտորոշական_և_բուժական",
                "services": ["էլեկտրասրտագրություն", "կորոնարոգրաֆիա", "ստենտավորում"],
                "comprehensive": True
            })
        },
        {
            "name": "Սրտի անոթների ստենտավորում",
            "description": "Կորոնար և ծայրամասային զարկերակների ստենտավորում՝ արյան հոսքը վերականգնելու համար",
            "price": Decimal("800000.00"),
            "attributes": json.dumps({
                "department": "կարդիոլոգիա",
                "type": "վիրահատական_միջամտություն",
                "procedure": "ստենտավորում",
                "target": ["կորոնար_զարկերակներ", "ծայրամասային_զարկերակներ"],
                "innovative": True
            })
        },
        {
            "name": "Ստամոքսի փոքրացման լապարասկոպիկ վիրահատություն",
            "description": "Նվազագույն ինվազիվ վիրահատական միջամտություն ստամոքսի փոքրացման համար",
            "price": Decimal("1200000.00"),
            "attributes": json.dumps({
                "department": "վիրաբուժություն",
                "type": "լապարասկոպիկ_վիրահատություն",
                "procedure": "ստամոքսի_փոքրացում",
                "minimally_invasive": True
            })
        },
        {
            "name": "Գինեկոլոգիական ծառայություններ",
            "description": "Գինեկոլոգիական ծառայությունների լայն շրջանակ՝ ներառյալ էսթետիկ գինեկոլոգիա",
            "price": Decimal("25000.00"),
            "attributes": json.dumps({
                "department": "գինեկոլոգիա",
                "type": "բժշկական_և_էսթետիկ",
                "comprehensive": True,
                "includes": ["ստանդարտ_գինեկոլոգիա", "էսթետիկ_գինեկոլոգիա"]
            })
        },
        {
            "name": "Վիրաբուժական ծառայություններ (Նանսեն մասնաճյուղ)",
            "description": "Բարձրակարգ բուժում և արագ ապաքինում ապահովող վիրահատական միջամտությունների ողջ ծավալ",
            "price": Decimal("300000.00"),
            "attributes": json.dumps({
                "location": "Նանսեն_մասնաճյուղ",
                "department": "վիրաբուժություն",
                "type": "ստացիոնար_վիրահատություն",
                "quality": "բարձրակարգ",
                "recovery": "արագ"
            })
        },
        {
            "name": "Թերապիա/Ընտանեկան բժշկություն",
            "description": "Ընդհանուր բժշկական խորհրդատվություն և բուժում",
            "price": Decimal("15000.00"),
            "attributes": json.dumps({
                "department": "թերապիա",
                "type": "ամբուլատոր_խորհրդատվություն",
                "family_medicine": True
            })
        },
        {
            "name": "Նյարդաբանություն",
            "description": "Նյարդաբանական հետազոտություններ և բուժում",
            "price": Decimal("20000.00"),
            "attributes": json.dumps({
                "department": "նյարդաբանություն",
                "type": "մասնագիտացված_խորհրդատվություն"
            })
        },
        {
            "name": "Էնդոկրինոլոգիա",
            "description": "Հորմոնային համակարգի հետազոտություն և բուժում",
            "price": Decimal("18000.00"),
            "attributes": json.dumps({
                "department": "էնդոկրինոլոգիա",
                "type": "մասնագիտացված_խորհրդատվություն",
                "focus": "հորմոնային_համակարգ"
            })
        },
        {
            "name": "Գաստրոէնտերոլոգիա",
            "description": "Մարսողական համակարգի հետազոտություն և բուժում",
            "price": Decimal("22000.00"),
            "attributes": json.dumps({
                "department": "գաստրոէնտերոլոգիա",
                "type": "մասնագիտացված_խորհրդատվություն",
                "focus": "մարսողական_համակարգ"
            })
        },
        {
            "name": "Ստոմատոլոգիա",
            "description": "Ատամնաբուժական ծառայություններ",
            "price": Decimal("12000.00"),
            "attributes": json.dumps({
                "department": "ստոմատոլոգիա",
                "type": "ատամնաբուժական_ծառայություն"
            })
        },
        {
            "name": "ԼՕՌ (Օտոլարինգոլոգիա)",
            "description": "Ականջ, քիթ, կոկորդի հետազոտություն և բուժում",
            "price": Decimal("16000.00"),
            "attributes": json.dumps({
                "department": "ԼՕՌ",
                "type": "մասնագիտացված_խորհրդատվություն",
                "focus": ["ականջ", "քիթ", "կոկորդ"]
            })
        },
        {
            "name": "Ակնաբուժություն",
            "description": "Աչքերի հետազոտություն և բուժում",
            "price": Decimal("14000.00"),
            "attributes": json.dumps({
                "department": "ակնաբուժություն",
                "type": "մասնագիտացված_խորհրդատվություն",
                "focus": "աչքեր"
            })
        },
        {
            "name": "Տրավմատոլոգիա-Օրթոպեդիա",
            "description": "Վնասվածքների և հենաշարժողական համակարգի հետազոտություն ու բուժում",
            "price": Decimal("25000.00"),
            "attributes": json.dumps({
                "department": "տրավմատոլոգիա_օրթոպեդիա",
                "type": "մասնագիտացված_խորհրդատվություն",
                "focus": ["վնասվածքներ", "հենաշարժողական_համակարգ"]
            })
        },
        {
            "name": "Պրոկտոլոգիա",
            "description": "Հետանցքային հետազոտություններ և բուժում",
            "price": Decimal("20000.00"),
            "attributes": json.dumps({
                "department": "պրոկտոլոգիա",
                "type": "մասնագիտացված_խորհրդատվություն"
            })
        },
        {
            "name": "Անգիովիրաբուժություն",
            "description": "Անոթային վիրահատական միջամտություններ",
            "price": Decimal("400000.00"),
            "attributes": json.dumps({
                "department": "անգիովիրաբուժություն",
                "type": "վիրահատական_միջամտություն",
                "focus": "անոթներ"
            })
        },
        {
            "name": "CHECK-UP կանխարգելիչ հետազոտություններ",
            "description": "Համապարփակ կանխարգելիչ բժշկական հետազոտություններ",
            "price": Decimal("80000.00"),
            "attributes": json.dumps({
                "type": "կանխարգելիչ_հետազոտություն",
                "comprehensive": True,
                "preventive": True
            })
        },
        {
            "name": "Վերականգնողական ծառայություններ",
            "description": "Կինեզաթերապիա և ֆիզիոթերապիա՝ նյարդաբանական և հենաշարժողական խնդիրների համար",
            "price": Decimal("12000.00"),
            "attributes": json.dumps({
                "location": "Քոչար_35/1",
                "type": "վերականգնողական_բուժում",
                "includes": ["կինեզաթերապիա", "ֆիզիոթերապիա"],
                "conditions": ["կաթված", "նյարդապաթիաներ", "ողնաշարի_ճողվածքներ"]
            })
        },
        {
            "name": "Տնային բուժում",
            "description": "Տնային պայմաններում բժշկական ծառայություններ",
            "price": Decimal("25000.00"),
            "attributes": json.dumps({
                "type": "տնային_ծառայություն",
                "location": "տուն",
                "includes": ["երեխաների_բուժում", "COVID-19_բուժում"]
            })
        }
    ]
    
    # Insert services
    for service in services:
        conn.execute(
            sa.text(
                """
                INSERT INTO offerings
                  (company_id, name, type, description, price, currency, attributes, created_at)
                VALUES
                  (:cid, :name, :type, :desc, :price, 'AMD', :attributes, :ts)
                """
            ),
            {
                "cid": company_id,
                "name": service["name"],
                "type": TYPE_SERVICE,
                "desc": service["description"],
                "price": service["price"],
                "attributes": service["attributes"],
                "ts": now,
            },
        )


def downgrade() -> None:
    conn = op.get_bind()
    
    # Get the company_id for Vardanants
    company_id = conn.execute(
        sa.text("SELECT id FROM companies WHERE name = :name"),
        {"name": "Վարդանանց Նորարար Բժշկության Կենտրոն"}
    ).scalar_one()
    
    # Product names to delete
    product_names = [
        "Սիրո քարտ +",
        "Վարդանանց Պրեմիում Խնամք փաթեթ",
        "Տնային բուժքույրական ծառայություն"
    ]
    
    # Service names to delete
    service_names = [
        "Մամոգրաֆիա",
        "Համակարգչային շերտագրում (CT)",
        "Ցերեկային ստացիոնար",
        "Մանկաբուժություն",
        "Ուրոլոգիական վիրահատություններ",
        "Կարդիոլոգիական ծառայություններ",
        "Սրտի անոթների ստենտավորում",
        "Ստամոքսի փոքրացման լապարասկոպիկ վիրահատություն",
        "Գինեկոլոգիական ծառայություններ",
        "Վիրաբուժական ծառայություններ (Նանսեն մասնաճյուղ)",
        "Թերապիա/Ընտանեկան բժշկություն",
        "Նյարդաբանություն",
        "Էնդոկրինոլոգիա",
        "Գաստրոէնտերոլոգիա",
        "Ստոմատոլոգիա",
        "ԼՕՌ (Օտոլարինգոլոգիա)",
        "Ակնաբուժություն",
        "Տրավմատոլոգիա-Օրթոպեդիա",
        "Պրոկտոլոգիա",
        "Անգիովիրաբուժություն",
        "CHECK-UP կանխարգելիչ հետազոտություններ",
        "Վերականգնողական ծառայություններ",
        "Տնային բուժում"
    ]
    
    # Delete products
    for product_name in product_names:
        conn.execute(
            sa.text("DELETE FROM products WHERE company_id = :cid AND name = :name"),
            {"cid": company_id, "name": product_name}
        )
    
    # Delete services
    for service_name in service_names:
        conn.execute(
            sa.text("DELETE FROM offerings WHERE company_id = :cid AND name = :name AND type = :type"),
            {"cid": company_id, "name": service_name, "type": TYPE_SERVICE}
        )
