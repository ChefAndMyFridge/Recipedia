# app/models/ingredients.py

from typing import Dict
from pydantic import BaseModel

class Ingredients(BaseModel):
    items: Dict[str, int]
    user: str