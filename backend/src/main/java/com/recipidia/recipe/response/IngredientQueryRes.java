package com.recipidia.recipe.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
<<<<<<<< 99f0fe05e3d448cb998020ad1fb903d8c2aba25f:backend/src/main/java/com/recipidia/recipe/response/IngredientQueryRes.java
public class IngredientQueryRes {
  private String name;
  private String quantity;
========
@JsonIgnoreProperties(ignoreUnknown = true)
public class VideoInfo {
  private String title;
  private String url;
  private String channel_title;
  private String duration;
  private long view_count;
  private long like_count;
>>>>>>>> 5a6628fdc3d1b55ff7e77442b4691297ab334954:backend/src/main/java/com/recipidia/recipe/response/VideoInfo.java
}