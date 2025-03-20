package com.recipidia.member.request;

import java.io.Serializable;

/**
 * 레시피 별점 부여 요청 DTO
 */
public record RatingReq(Long memberId, Long recipeId, Integer rating) implements Serializable { }
