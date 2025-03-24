package com.recipidia.filter.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
public class MemberFilterUpdateReq {
  private List<String> preferredGenres;
  private List<String> dislikedGenres;
  private List<String> preferredDietaries;
  private List<String> dislikedDietaries;
  private List<String> preferredIngredients;
  private List<String> dislikedIngredients;
}
