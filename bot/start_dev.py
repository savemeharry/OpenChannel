import os
import sys
from dotenv import load_dotenv
import logging
import multiprocessing
import uvicorn

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

def run_bot():
    """Run the Telegram bot using polling."""
    from src.main import main
    logger.info("Starting Telegram bot with polling...")
    main()

def run_api():
    """Run the FastAPI server."""
    logger.info("Starting FastAPI server...")
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)

def run_seed():
    """Run the seed script to add initial subscription plans."""
    from src.seed_plans import seed_subscription_plans
    logger.info("Checking and seeding subscription plans...")
    seed_subscription_plans()

if __name__ == "__main__":
    logger.info("Starting development environment...")
    
    # Run seed script first
    run_seed()
    
    # Start bot and API in separate processes
    bot_process = multiprocessing.Process(target=run_bot)
    api_process = multiprocessing.Process(target=run_api)
    
    # Start all processes
    bot_process.start()
    api_process.start()
    
    try:
        # Wait for processes to complete (they won't, but this keeps the script running)
        bot_process.join()
        api_process.join()
    except KeyboardInterrupt:
        logger.info("Stopping development environment...")
        
        # Terminate processes
        bot_process.terminate()
        api_process.terminate()
        
        # Wait for processes to terminate
        bot_process.join()
        api_process.join()
        
        logger.info("Development environment stopped.") 