from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, BigInteger
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    user_id = Column(BigInteger, primary_key=True)
    subscription_plan_id = Column(Integer, ForeignKey('subscription_plans.plan_id'), nullable=True)
    subscription_expiration_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    subscription_plan = relationship("SubscriptionPlan", back_populates="users")
    transactions = relationship("Transaction", back_populates="user")
    
    def is_subscription_active(self):
        if not self.subscription_expiration_date:
            return False
        return datetime.utcnow() < self.subscription_expiration_date


class SubscriptionPlan(Base):
    __tablename__ = 'subscription_plans'
    
    plan_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    price_in_stars = Column(Integer, nullable=False)
    subscription_period_days = Column(Integer, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    users = relationship("User", back_populates="subscription_plan")
    transactions = relationship("Transaction", back_populates="subscription_plan")


class Transaction(Base):
    __tablename__ = 'transactions'
    
    transaction_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('users.user_id'), nullable=False)
    plan_id = Column(Integer, ForeignKey('subscription_plans.plan_id'), nullable=False)
    payment_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    amount_paid_in_stars = Column(Integer, nullable=False)
    subscription_expiration_date = Column(DateTime, nullable=False)
    telegram_payment_charge_id = Column(String, nullable=False)
    
    user = relationship("User", back_populates="transactions")
    subscription_plan = relationship("SubscriptionPlan", back_populates="transactions") 