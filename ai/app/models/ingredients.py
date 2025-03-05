# app/models/ingredients.py

from typing import List, Optional
from pydantic import BaseModel

class Ingredients(BaseModel):
    ingredients: List[str]
    main_ingredient: Optional[str] = None