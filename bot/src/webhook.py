import os
import logging
from datetime import datetime, timedelta
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, ChatJoinRequestHandler, ContextTypes
from fastapi import FastAPI, Request, Depends, BackgroundTasks
from sqlalchemy.orm import Session
import json

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
app = FastAPI(title="OpenChannel Webhook API")

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)

# Initialize the Telegram bot
application = Application.builder().token(BOT_TOKEN).build()

# Bot command handlers
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /start is issued."""
    from telegram import InlineKeyboardButton, InlineKeyboardMarkup
    
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

async def process_payment_update(update: Update, db: Session):
    """Process a successful payment update."""
    user_id = update.pre_checkout_query.from_user.id if update.pre_checkout_query else update.message.from_user.id
    
    # Get the user from the database
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        user = User(user_id=user_id)
        db.add(user)
    
    if update.message and update.message.successful_payment:
        payment = update.message.successful_payment
        
        # Parse the invoice payload to get the plan_id
        payload = payment.invoice_payload
        parts = payload.split('_')
        if len(parts) >= 3 and parts[0] == 'sub':
            plan_id = int(parts[1])
            
            # Get the subscription plan
            plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_id == plan_id).first()
            if plan:
                # Calculate the subscription expiration date
                now = datetime.utcnow()
                expiration_date = now + timedelta(days=plan.subscription_period_days)
                
                # Update user's subscription
                user.subscription_plan_id = plan.plan_id
                user.subscription_expiration_date = expiration_date
                
                # Create a transaction record
                transaction = Transaction(
                    user_id=user_id,
                    plan_id=plan_id,
                    amount_paid_in_stars=payment.total_amount // 100,  # Convert from cents to stars
                    subscription_expiration_date=expiration_date,
                    telegram_payment_charge_id=payment.telegram_payment_charge_id
                )
                db.add(transaction)
                db.commit()
                
                # Send a confirmation message to the user
                bot = application.bot
                await bot.send_message(
                    chat_id=user_id,
                    text=f"Thank you for your subscription! You now have access to our closed group until {expiration_date.strftime('%Y-%m-%d')}."
                )
                
                logger.info(f"Processed payment for user {user_id}, plan {plan_id}")

# Set up handlers
application.add_handler(CommandHandler("start", start))
application.add_handler(ChatJoinRequestHandler(handle_chat_join_request))

@app.post(f"/webhook/{BOT_TOKEN}")
async def webhook(request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Handle incoming Telegram webhook updates."""
    data = await request.json()
    update = Update.de_json(data, application.bot)
    
    # Process regular updates
    await application.process_update(update)
    
    # Process payment updates in the background
    if (update.message and update.message.successful_payment) or update.pre_checkout_query:
        background_tasks.add_task(process_payment_update, update, db)
    
    return {"status": "ok"}

@app.on_event("startup")
async def startup():
    """Set the webhook on startup."""
    await application.bot.set_webhook(url=f"{WEBHOOK_URL}/webhook/{BOT_TOKEN}")
    logger.info(f"Webhook set to {WEBHOOK_URL}/webhook/{BOT_TOKEN}")
    
    # Register all API routes
    from main import router
    app.include_router(router)

@app.on_event("shutdown")
async def shutdown():
    """Remove the webhook on shutdown."""
    await application.bot.delete_webhook()
    logger.info("Webhook removed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 