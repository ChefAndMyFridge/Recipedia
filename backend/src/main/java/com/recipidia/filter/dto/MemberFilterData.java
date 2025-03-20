package com.recipidia.filter.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MemberFilterData {
  private List<String> preferredGenres;
  private List<String> dislikedGenres;
  private List<String> preferredDietaries;
  private List<String> dislikedDietaries;
  private List<String> preferredIngredients;
  private List<String> dislikedIngredients;
}
