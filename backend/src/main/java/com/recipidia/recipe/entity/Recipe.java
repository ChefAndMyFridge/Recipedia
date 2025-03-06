package com.recipidia.recipe.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.recipidia.ingredient.request.IngredientUpdateReq;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column(unique = true)
    private String youtubeUrl;

    @Column
    private String textRecipe = null;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private final List<RecipeIngredient> ingredients = new ArrayList<>(); // 빈 리스트로 초기화


    @Builder
    public Recipe(String name, String youtubeUrl) {
        this.name = name;
        this.youtubeUrl = youtubeUrl;
    }

    public void setTextRecipe(String textRecipe) {
        this.textRecipe = textRecipe;
    }

}
