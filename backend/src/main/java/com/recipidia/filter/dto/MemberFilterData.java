package com.recipidia.filter.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberFilterData {
  private List<String> preferredGenres;
  private List<String> dislikedGenres;
  private List<String> preferredDietaries;
  private List<String> dislikedDietaries;
  private List<String> preferredIngredients;
  private List<String> dislikedIngredients;
}

//{
//    "preferredGenres": ["소고기", "돼지고기"],
//    "dislikedGenres": ["채소"],
//    "preferredDietaries": ["고단백"],
//    "dislikedDietaries": ["저탄수화물"],
//    "preferredIngredients": ["마늘", "양파"],
//    "dislikedIngredients": ["피망"],
//    }

