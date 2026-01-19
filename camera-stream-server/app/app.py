from fastapi import FastAPI
from app.routes.http_streams import router as http_router
from app.routes.websockets import router as ws_router

app = FastAPI()

# include the routers as endpoints in the server
app.include_router(http_router)
app.include_router(ws_router)
