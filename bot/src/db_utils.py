import os
import logging
from datetime import datetime
from telegram import Bot
from sqlalchemy import and_
from dotenv import load_dotenv

# Import database models and connection
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.db import SessionLocal
from database.models import User, SubscriptionPlan, Transaction

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

# Get group chat ID from environment
GROUP_CHAT_ID = os.getenv("GROUP_CHAT_ID")

async def check_and_remove_expired_subscriptions(bot: Bot):
    """Check for expired subscriptions and remove users from the group."""
    db = SessionLocal()
    
    try:
        # Get users with expired subscriptions
        current_time = datetime.utcnow()
        expired_users = db.query(User).filter(
            and_(
                User.subscription_expiration_date < current_time,
                User.subscription_expiration_date.isnot(None)
            )
        ).all()
        
        logger.info(f"Found {len(expired_users)} users with expired subscriptions")
        
        for user in expired_users:
            try:
                # Ban user temporarily to kick them from the group
                await bot.ban_chat_member(
                    chat_id=GROUP_CHAT_ID,
                    user_id=user.user_id,
                    until_date=datetime.utcnow().timestamp() + 40  # Ban for 40 seconds
                )
                logger.info(f"Removed user {user.user_id} from group due to expired subscription")
                
                # Notify user
                await bot.send_message(
                    chat_id=user.user_id,
                    text="Your subscription has expired. You have been removed from the group. "
                         "Please renew your subscription to rejoin."
                )
            except Exception as e:
                logger.error(f"Error removing user {user.user_id} from group: {e}")
            
    finally:
        db.close()

def get_user_subscription_status(user_id: int):
    """Get the subscription status for a user."""
    db = SessionLocal()
    
    try:
        user = db.query(User).filter(User.user_id == user_id).first()
        
        if not user:
            return {
                "user_id": user_id,
                "has_active_subscription": False
            }
        
        has_active_subscription = user.is_subscription_active()
        
        response = {
            "user_id": user.user_id,
            "has_active_subscription": has_active_subscription
        }
        
        if has_active_subscription and user.subscription_plan_id:
            plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_id == user.subscription_plan_id).first()
            time_left = user.subscription_expiration_date - datetime.utcnow()
            
            response.update({
                "plan_name": plan.name if plan else None,
                "expiration_date": user.subscription_expiration_date,
                "time_left_days": time_left.days if time_left.days > 0 else 0
            })
        
        return response
    
    finally:
        db.close()

def update_user_subscription(user_id: int, plan_id: int, payment_charge_id: str, amount_paid: int):
    """Update a user's subscription based on payment."""
    db = SessionLocal()
    
    try:
        # Get or create user
        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            user = User(user_id=user_id)
            db.add(user)
        
        # Get subscription plan
        plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_id == plan_id).first()
        if not plan:
            return None
        
        # Calculate expiration date
        now = datetime.utcnow()
        expiration_date = now
        
        # If user already has a subscription, extend it
        if user.subscription_expiration_date and user.subscription_expiration_date > now:
            expiration_date = user.subscription_expiration_date
        
        expiration_date = expiration_date + datetime.timedelta(days=plan.subscription_period_days)
        
        # Update user subscription
        user.subscription_plan_id = plan.plan_id
        user.subscription_expiration_date = expiration_date
        
        # Create transaction
        transaction = Transaction(
            user_id=user_id,
            plan_id=plan_id,
            amount_paid_in_stars=amount_paid,
            subscription_expiration_date=expiration_date,
            telegram_payment_charge_id=payment_charge_id
        )
        
        db.add(transaction)
        db.commit()
        
        return {
            "user_id": user.user_id,
            "plan_id": plan.plan_id,
            "plan_name": plan.name,
            "expiration_date": expiration_date,
            "transaction_id": transaction.transaction_id
        }
    
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating subscription: {e}")
        return None
    
    finally:
        db.close() 