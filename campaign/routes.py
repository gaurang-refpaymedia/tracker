from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Union

from . import crud, schemas
from app import database, auth
from app.models import User
from subuser.models import SubUser

router = APIRouter(prefix="/api/campaigns", tags=["Campaigns"])

# Define type alias for the current identity for cleaner type hints
Identity = Union[User, SubUser]

# ===================================================================
# Campaign Category Routes
# ===================================================================

@router.post("_categories/", response_model=schemas.CampaignCategoryOut)
def create_campaign_category(
    category: schemas.CampaignCategoryCreate,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    return crud.create_campaign_category(db, category, current_identity.get("user_code",""))

@router.get("_categories/", response_model=List[schemas.CampaignCategoryOut])
def get_all_categories(db: Session = Depends(database.get_db)):
    return crud.get_all_campaign_categories(db)

# ===================================================================
# Main Campaign Routes
# ===================================================================

@router.post("/", response_model=schemas.CampaignOut)
def create_campaign(
    campaign: schemas.CampaignCreate,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    return crud.create_campaign(
        db,
        campaign=campaign,
        company_id=current_identity.get("company_id",""),
        user_code=current_identity.get("user_code","")
    )

@router.get("/", response_model=List[schemas.CampaignOut])
def get_company_campaigns(
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):  
    print(current_identity)
    return crud.get_campaigns_for_company(db, current_identity.get("company_id",""))

@router.get("/{campaign_id}", response_model=schemas.CampaignOut)
def get_campaign(
    campaign_id: int,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    campaign = crud.get_campaign(db, campaign_id, current_identity.get("company_id",""))
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@router.put("/{campaign_id}", response_model=schemas.CampaignOut)
def update_campaign(
    campaign_id: int,
    campaign_update: schemas.CampaignUpdate,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    campaign = crud.update_campaign(
        db,
        campaign_id=campaign_id,
        campaign_update=campaign_update,
        company_id=current_identity.get("company_id",""),
        user_code=current_identity.get("user_code","")
    )
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

# ===================================================================
# Nested Routes for Campaign Payouts
# ===================================================================

@router.post("/{campaign_id}/payouts/", response_model=schemas.CampaignPayoutOut)
def create_campaign_payout(
    campaign_id: int,
    payout: schemas.CampaignPayoutCreate,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    crud.get_campaign(db, campaign_id, current_identity.get("company_id",""))
    return crud.create_campaign_payout(db, campaign_id, payout, current_identity.get("user_code",""))

@router.get("/{campaign_id}/payouts/", response_model=List[schemas.CampaignPayoutOut])
def list_campaign_payouts(
    campaign_id: int,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    crud.get_campaign(db, campaign_id, current_identity.get("company_id",""))
    return crud.get_payouts_for_campaign(db, campaign_id)

@router.get("/{campaign_id}/payouts/{payout_id}", response_model=schemas.CampaignPayoutOut)
def get_campaign_payout(
    campaign_id: int,
    payout_id: int,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    crud.get_campaign(db, campaign_id, current_identity.get("company_id",""))
    payout = crud.get_payout(db, payout_id)
    if not payout or payout.campaign_id != campaign_id:
        raise HTTPException(status_code=404, detail="Payout not found")
    return payout

@router.put("/{campaign_id}/payouts/{payout_id}", response_model=schemas.CampaignPayoutOut)
def update_campaign_payout(
    campaign_id: int,
    payout_id: int,
    payout_update: schemas.CampaignPayoutUpdate,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    crud.get_campaign(db, campaign_id, current_identity.get("company_id",""))
    payout = crud.update_payout(db, payout_id, payout_update, current_identity.get("user_code",""))
    if not payout or payout.campaign_id != campaign_id:
        raise HTTPException(status_code=404, detail="Payout not found")
    return payout

# ===================================================================
# Nested Routes for Campaign Goals
# ===================================================================

@router.post("/{campaign_id}/goals/", response_model=schemas.CampaignGoalOut)
def create_campaign_goal(
    campaign_id: int,
    goal: schemas.CampaignGoalCreate,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    crud.get_campaign(db, campaign_id, current_identity.get("company_id",""))
    return crud.create_campaign_goal(db, campaign_id, goal, current_identity.get("user_code",""))

@router.get("/{campaign_id}/goals/", response_model=List[schemas.CampaignGoalOut])
def list_campaign_goals(
    campaign_id: int,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    crud.get_campaign(db, campaign_id, current_identity.get("company_id",""))
    return crud.get_goals_for_campaign(db, campaign_id)

@router.get("/{campaign_id}/goals/{goal_id}", response_model=schemas.CampaignGoalOut)
def get_campaign_goal(
    campaign_id: int,
    goal_id: int,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    crud.get_campaign(db, campaign_id, current_identity.get("company_id",""))
    goal = crud.get_goal(db, goal_id)
    if not goal or goal.campaign_id != campaign_id:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal
    
@router.put("/{campaign_id}/goals/{goal_id}", response_model=schemas.CampaignGoalOut)
def update_campaign_goal(
    campaign_id: int,
    goal_id: int,
    goal_update: schemas.CampaignGoalUpdate,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    crud.get_campaign(db, campaign_id, current_identity.get("company_id",""))
    goal = crud.update_goal(db, goal_id, goal_update, current_identity.get("user_code",""))
    if not goal or goal.campaign_id != campaign_id:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal

# ===================================================================
# Nested Routes for Campaign Targeting Rules
# ===================================================================

@router.post("/{campaign_id}/targeting-rules/", response_model=schemas.CampaignTargetingRuleOut)
def create_targeting_rule(
    campaign_id: int,
    rule: schemas.CampaignTargetingRuleCreate,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    crud.get_campaign(db, campaign_id, current_identity.get("company_id",""))
    return crud.create_targeting_rule(db, campaign_id, rule, current_identity.get("user_code",""))

@router.get("/{campaign_id}/targeting-rules/", response_model=List[schemas.CampaignTargetingRuleOut])
def list_targeting_rules(
    campaign_id: int,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    crud.get_campaign(db, campaign_id, current_identity.get("company_id",""))
    return crud.get_rules_for_campaign(db, campaign_id)

@router.get("/{campaign_id}/targeting-rules/{rule_id}", response_model=schemas.CampaignTargetingRuleOut)
def get_targeting_rule(
    campaign_id: int,
    rule_id: int,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    crud.get_campaign(db, campaign_id, current_identity.get("company_id",""))
    rule = crud.get_rule(db, rule_id)
    if not rule or rule.campaign_id != campaign_id:
        raise HTTPException(status_code=404, detail="Targeting rule not found")
    return rule

@router.put("/{campaign_id}/targeting-rules/{rule_id}", response_model=schemas.CampaignTargetingRuleOut)
def update_targeting_rule(
    campaign_id: int,
    rule_id: int,
    rule_update: schemas.CampaignTargetingRuleUpdate,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    crud.get_campaign(db, campaign_id, current_identity.get("company_id",""))
    rule = crud.update_rule(db, rule_id, rule_update, current_identity.get("user_code",""))
    if not rule or rule.campaign_id != campaign_id:
        raise HTTPException(status_code=404, detail="Targeting rule not found")
    return rule
