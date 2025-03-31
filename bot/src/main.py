import os
import logging
from datetime import datetime, timedelta
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ChatJoinRequestHandler, ContextTypes
import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

# Import database models and connection
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.db import get_db, engine
from database.models import Base, User, SubscriptionPlan, Transaction

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

# Get environment variables
BOT_TOKEN = os.getenv("BOT_TOKEN")
WEBHOOK_URL = os.getenv("WEBHOOK_URL")
MINI_APP_URL = os.getenv("MINI_APP_URL")
GROUP_CHAT_ID = os.getenv("GROUP_CHAT_ID")

# Initialize FastAPI
app = FastAPI(title="OpenChannel API")

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)

# Bot command handlers
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /start is issued."""
    user = update.effective_user
    
    # Check if user exists in database, if not, create a new user
    db = next(get_db())
    db_user = db.query(User).filter(User.user_id == user.id).first()
    if not db_user:
        db_user = User(user_id=user.id)
        db.add(db_user)
        db.commit()
    
    # Create inline keyboard with button to open mini app
    keyboard = [
        [InlineKeyboardButton("Open Mini App", web_app={"url": MINI_APP_URL})],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_html(
        f"Hi {user.mention_html()}! Welcome to OpenChannel.\n\n"
        f"This bot helps you manage your subscription to our closed group.\n\n"
        f"Click the button below to open the Mini App and manage your subscription.",
        reply_markup=reply_markup,
    )

async def handle_chat_join_request(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle chat join requests by checking user's subscription status."""
    user = update.chat_join_request.from_user
    chat = update.chat_join_request.chat
    
    # Check if user has active subscription
    db = next(get_db())
    db_user = db.query(User).filter(User.user_id == user.id).first()
    
    if db_user and db_user.is_subscription_active():
        # Approve join request
        await chat.approve_join_request(user.id)
        logger.info(f"Approved join request for user {user.id}")
    else:
        # Decline join request
        await chat.decline_join_request(user.id)
        logger.info(f"Declined join request for user {user.id} - no active subscription")
        
        # Send message to user
        await context.bot.send_message(
            chat_id=user.id,
            text="Your join request was declined because you don't have an active subscription. "
                 "Please purchase a subscription through our bot.",
        )

async def check_expired_subscriptions(context: ContextTypes.DEFAULT_TYPE) -> None:
    """Check for expired subscriptions and remove users from the group."""
    db = next(get_db())
    
    # Get users with expired subscriptions
    current_time = datetime.utcnow()
    expired_users = db.query(User).filter(
        User.subscription_expiration_date < current_time,
        User.subscription_expiration_date.isnot(None)
    ).all()
    
    for user in expired_users:
        try:
            # Ban user temporarily to kick them from the group
            # Setting until_date to a time in the near future will kick them without banning permanently
            await context.bot.ban_chat_member(
                chat_id=GROUP_CHAT_ID,
                user_id=user.user_id,
                until_date=datetime.utcnow() + timedelta(seconds=40)
            )
            logger.info(f"Removed user {user.user_id} from group due to expired subscription")
            
            # Notify user
            await context.bot.send_message(
                chat_id=user.user_id,
                text="Your subscription has expired. You have been removed from the group. "
                     "Please renew your subscription to rejoin.",
            )
        except Exception as e:
            logger.error(f"Error removing user {user.user_id} from group: {e}")

def main() -> None:
    """Start the bot and API server."""
    # Create the Application and pass it your bot's token
    application = Application.builder().token(BOT_TOKEN).build()

    # on different commands - answer in Telegram
    application.add_handler(CommandHandler("start", start))
    
    # Handle chat join requests
    application.add_handler(ChatJoinRequestHandler(handle_chat_join_request))
    
    # Set up the job to check for expired subscriptions daily
    job_queue = application.job_queue
    job_queue.run_repeating(check_expired_subscriptions, interval=86400, first=10)

    # Start the Bot using polling
    application.run_polling()

# API endpoints for the mini app
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import requests

router = APIRouter()

class SubscriptionPlanResponse(BaseModel):
    plan_id: int
    name: str
    price_in_stars: int
    subscription_period_days: int
    description: Optional[str] = None

class CreateInvoiceRequest(BaseModel):
    plan_id: int
    user_id: int

class SubscriptionStatusResponse(BaseModel):
    user_id: int
    has_active_subscription: bool
    plan_name: Optional[str] = None
    expiration_date: Optional[datetime] = None
    time_left_days: Optional[int] = None

@router.get("/plans", response_model=List[SubscriptionPlanResponse])
def get_plans(db: Session = Depends(get_db)):
    """Get all subscription plans."""
    plans = db.query(SubscriptionPlan).all()
    return plans

@router.post("/create_invoice")
def create_invoice(request: CreateInvoiceRequest, db: Session = Depends(get_db)):
    """Create an invoice for subscription payment."""
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_id == request.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Subscription plan not found")
    
    # Create payload for Telegram Bot API
    payload = {
        "title": f"{plan.name} Subscription",
        "description": plan.description or f"Access to our closed group for {plan.subscription_period_days} days",
        "payload": f"sub_{plan.plan_id}_{request.user_id}",
        "provider_token": "381764678:TEST:51233",  # Replace with your provider token
        "currency": "STARS",
        "prices": [{"label": plan.name, "amount": plan.price_in_stars * 100}],  # Amount in cents (stars)
        "subscription_period": f"{plan.subscription_period_days}_days"
    }
    
    # Call Telegram Bot API to create invoice
    response = requests.post(
        f"https://api.telegram.org/bot{BOT_TOKEN}/createInvoiceLink",
        json=payload
    )
    
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to create invoice")
    
    return {"invoice_link": response.json()["result"]}

@router.get("/subscription_status", response_model=SubscriptionStatusResponse)
def get_subscription_status(user_id: int, db: Session = Depends(get_db)):
    """Get subscription status for a user."""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
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

app.include_router(router)

if __name__ == "__main__":
    # Run in separate processes to handle both the bot and API server
    import multiprocessing
    
    bot_process = multiprocessing.Process(target=main)
    bot_process.start()
    
    # Start FastAPI server
    uvicorn.run(app, host="0.0.0.0", port=8000) 