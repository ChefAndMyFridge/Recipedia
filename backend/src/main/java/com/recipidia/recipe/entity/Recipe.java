package com.recipidia.recipe.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.recipidia.recipe.response.RecipeExtractRes;
import com.recipidia.recipe.converter.RecipeExtractResConverter;
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

    @Column
    private String channelTitle;   // VideoInfo의 channelTitle

    @Column
    private String duration;       // VideoInfo의 duration

    @Column
    private Long viewCount;        // VideoInfo의 viewCount

    @Column
    private Long likeCount;        // VideoInfo의 likeCount

    @Column
    private Boolean hasCaption = false;    // VideoInfo의 hasCaption

    // textRecipe를 RecipeExtractRes 타입으로 변경하고, JSON 직렬화를 위한 Converter 적용
    @Column(columnDefinition = "MEDIUMTEXT")
    @Convert(converter = RecipeExtractResConverter.class)
    private RecipeExtractRes textRecipe = null;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private final List<RecipeIngredient> ingredients = new ArrayList<>(); // 빈 리스트로 초기화


    @Builder
    public Recipe(String name, String youtubeUrl, String title,
                  String channelTitle, String duration,
                  Long viewCount, Long likeCount, Boolean hasCaption) {
        this.name = name;
        this.youtubeUrl = youtubeUrl;
        this.title = title;
        this.channelTitle = channelTitle;
        this.duration = duration;
        this.viewCount = viewCount;
        this.likeCount = likeCount;
        this.hasCaption = hasCaption;
    }
    // 외부에서 이 메소드를 통해서만 textRecipe를 변경하도록 함
    public void modifyTextRecipe(RecipeExtractRes extractRes) {
        this.textRecipe = extractRes;
    }

    // VideoInfo 부분 업데이트 필요 시 활용하기 (조회 수, 좋아요 수 등 수정)
    public void updateVideoInfo(String channelTitle, String duration, Long viewCount,
                                Long likeCount, Boolean hasCaption) {
        this.channelTitle = channelTitle;
        this.duration = duration;
        this.viewCount = viewCount;
        this.likeCount = likeCount;
        this.hasCaption = hasCaption;
    }

    // 에러코드 처리 시 hasCaption 값 false로 조정
    public void noCaption() {
        this.hasCaption = false;
    }

}
