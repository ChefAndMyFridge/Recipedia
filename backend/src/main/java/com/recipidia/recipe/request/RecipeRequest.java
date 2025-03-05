package com.recipidia.recipe.request;


import java.util.List;

public class RecipeRequest {
    private List<String> ingredients; // 프론트엔드에서 전달받은 main ingredients 목록

    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }
}