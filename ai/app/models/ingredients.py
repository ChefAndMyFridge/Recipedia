# app/models/ingredients.py

from typing import List
from pydantic import BaseModel


class Ingredients(BaseModel):
    ingredients: List[str] = None
    main_ingredients: List[str] = None
