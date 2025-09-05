from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List

# Import your app's models and schemas
from . import models, schemas
from app.models import Currency
from publisher.models import Publisher

# ===================================================================
# Campaign Category CRUD
# ===================================================================

def create_campaign_category(db: Session, category: schemas.CampaignCategoryCreate, user_code: str):
    db_category = models.CampaignCategory(
        **category.dict(),
        created_by=user_code,
        updated_by=user_code
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_all_campaign_categories(db: Session):
    return db.query(models.CampaignCategory).all()

# ===================================================================
# Campaign CRUD
# ===================================================================

def create_campaign(db: Session, campaign: schemas.CampaignCreate, company_id: int, user_code: str):
    # Handle dynamic defaults for currency and category
    default_currency = db.query(Currency).filter(Currency.code == "USD").first()
    if not default_currency:
        raise HTTPException(status_code=404, detail="Default currency 'USD' not found")

    default_category = db.query(models.CampaignCategory).filter(models.CampaignCategory.category_name == "General").first()
    if not default_category:
        # For this example, we create it if it doesn't exist. You might want different logic.
        default_category = create_campaign_category(
            db, 
            schemas.CampaignCategoryCreate(category_name="General", category_slug="general"),
            user_code
        )

    db_campaign = models.Campaign(
        **campaign.dict(exclude={"publishers_assigned_ids", "blocked_publishers_ids"}),
        company_id=company_id,
        currency_id=default_currency.id,
        category_id=default_category.id,
        created_by=user_code,
        updated_by=user_code
    )

    # Handle publisher relationships
    if campaign.publishers_assigned_ids:
        assigned_pubs = db.query(Publisher).filter(Publisher.id.in_(campaign.publishers_assigned_ids)).all()
        db_campaign.publishers_assigned = assigned_pubs
    
    if campaign.blocked_publishers_ids:
        blocked_pubs = db.query(Publisher).filter(Publisher.id.in_(campaign.blocked_publishers_ids)).all()
        db_campaign.blocked_publishers = blocked_pubs

    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

def get_campaigns_for_company(db: Session, company_id: int):
    return db.query(models.Campaign).filter(models.Campaign.company_id == company_id).all()

def get_campaign(db: Session, campaign_id: int, company_id: int):
    campaign = db.query(models.Campaign).filter(
        models.Campaign.id == campaign_id,
        models.Campaign.company_id == company_id
    ).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found or access denied")
    return campaign

def update_campaign(db: Session, campaign_id: int, campaign_update: schemas.CampaignUpdate, company_id: int, user_code: str):
    db_campaign = get_campaign(db, campaign_id, company_id)
    update_data = campaign_update.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_campaign, key, value)
    
    db_campaign.updated_by = user_code
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

# ===================================================================
# Campaign Payout CRUD
# ===================================================================

def create_campaign_payout(db: Session, campaign_id: int, payout: schemas.CampaignPayoutCreate, user_code: str):
    db_payout = models.CampaignPayout(
        **payout.dict(exclude={"publisher_ids"}),
        campaign_id=campaign_id,
        created_by=user_code,
        updated_by=user_code
    )
    if payout.publisher_ids:
        db_payout.publishers = db.query(Publisher).filter(Publisher.id.in_(payout.publisher_ids)).all()
        
    db.add(db_payout)
    db.commit()
    db.refresh(db_payout)
    return db_payout

def get_payouts_for_campaign(db: Session, campaign_id: int):
    return db.query(models.CampaignPayout).filter(models.CampaignPayout.campaign_id == campaign_id).all()

def get_payout(db: Session, payout_id: int):
    return db.query(models.CampaignPayout).filter(models.CampaignPayout.id == payout_id).first()

def update_payout(db: Session, payout_id: int, payout_update: schemas.CampaignPayoutUpdate, user_code: str):
    db_payout = get_payout(db, payout_id)
    if not db_payout:
        return None
    update_data = payout_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_payout, key, value)
    db_payout.updated_by = user_code
    db.commit()
    db.refresh(db_payout)
    return db_payout

# ===================================================================
# Campaign Goal CRUD
# ===================================================================

def create_campaign_goal(db: Session, campaign_id: int, goal: schemas.CampaignGoalCreate, user_code: str):
    db_goal = models.CampaignGoal(
        **goal.dict(),
        campaign_id=campaign_id,
        created_by=user_code,
        updated_by=user_code
    )
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

def get_goals_for_campaign(db: Session, campaign_id: int):
    return db.query(models.CampaignGoal).filter(models.CampaignGoal.campaign_id == campaign_id).all()

def get_goal(db: Session, goal_id: int):
    return db.query(models.CampaignGoal).filter(models.CampaignGoal.id == goal_id).first()

def update_goal(db: Session, goal_id: int, goal_update: schemas.CampaignGoalUpdate, user_code: str):
    db_goal = get_goal(db, goal_id)
    if not db_goal:
        return None
    update_data = goal_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_goal, key, value)
    db_goal.updated_by = user_code
    db.commit()
    db.refresh(db_goal)
    return db_goal

# ===================================================================
# Campaign Targeting Rule CRUD
# ===================================================================

def create_targeting_rule(db: Session, campaign_id: int, rule: schemas.CampaignTargetingRuleCreate, user_code: str):
    db_rule = models.CampaignTargetingRule(
        **rule.dict(),
        campaign_id=campaign_id,
        created_by=user_code,
        updated_by=user_code
    )
    db.add(db_rule)
    db.commit()
    db.refresh(db_rule)
    return db_rule

def get_rules_for_campaign(db: Session, campaign_id: int):
    return db.query(models.CampaignTargetingRule).filter(models.CampaignTargetingRule.campaign_id == campaign_id).all()

def get_rule(db: Session, rule_id: int):
    return db.query(models.CampaignTargetingRule).filter(models.CampaignTargetingRule.id == rule_id).first()

def update_rule(db: Session, rule_id: int, rule_update: schemas.CampaignTargetingRuleUpdate, user_code: str):
    db_rule = get_rule(db, rule_id)
    if not db_rule:
        return None
    update_data = rule_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_rule, key, value)
    db_rule.updated_by = user_code
    db.commit()
    db.refresh(db_rule)
    return db_rule
