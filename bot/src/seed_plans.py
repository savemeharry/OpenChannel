import sys
import os
from dotenv import load_dotenv

# Import database models and connection
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.db import SessionLocal
from database.models import SubscriptionPlan

# Load environment variables
load_dotenv()

def seed_subscription_plans():
    """Add initial subscription plans to the database."""
    db = SessionLocal()
    
    # Check if there are already plans in the database
    existing_plans = db.query(SubscriptionPlan).count()
    if existing_plans > 0:
        print("Plans already exist in the database. Skipping seed.")
        return
    
    # Define the plans
    plans = [
        {
            "name": "Monthly Basic",
            "price_in_stars": 100,
            "subscription_period_days": 30,
            "description": "Basic access to our closed group for 30 days."
        },
        {
            "name": "Quarterly Premium",
            "price_in_stars": 250,
            "subscription_period_days": 90,
            "description": "Premium access to our closed group for 90 days. Save 16% compared to monthly."
        },
        {
            "name": "Annual VIP",
            "price_in_stars": 900,
            "subscription_period_days": 365,
            "description": "VIP access to our closed group for 365 days. Save 25% compared to monthly."
        }
    ]
    
    # Add plans to the database
    for plan_data in plans:
        plan = SubscriptionPlan(**plan_data)
        db.add(plan)
    
    db.commit()
    print(f"Added {len(plans)} subscription plans to the database.")

if __name__ == "__main__":
    seed_subscription_plans() 