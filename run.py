import uvicorn
if __name__ == "__main__":
    uvicorn.run("app.main:app", reload=True)


"""


ALEMBIC DATABASE MIGRATION COMMANDS - 


alembic revision --autogenerate -m "change in the advertiser module"
alembic upgrade head


"""