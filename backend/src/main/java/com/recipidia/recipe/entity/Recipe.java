package com.recipidia.recipe.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.recipidia.recipe.response.RecipeExtractRes;
import com.recipidia.recipe.response.RecipeExtractResConverter;
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

    @Column
    private String title;

    @Column(unique = true)
    private String youtubeUrl;

    // textRecipe를 RecipeExtractRes 타입으로 변경하고, JSON 직렬화를 위한 Converter 적용
    @Column(columnDefinition = "MEDIUMTEXT")
    @Convert(converter = RecipeExtractResConverter.class)
    private RecipeExtractRes textRecipe = null;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private final List<RecipeIngredient> ingredients = new ArrayList<>(); // 빈 리스트로 초기화


    @Builder
    public Recipe(String name, String title, String youtubeUrl) {
        this.name = name;
        this.title = title;
        this.youtubeUrl = youtubeUrl;
    }

    // 외부에서 이 메소드를 통해서만 textRecipe를 변경하도록 함
    public void modifyTextRecipe(RecipeExtractRes extractRes) {
        this.textRecipe = extractRes;
    }

}
