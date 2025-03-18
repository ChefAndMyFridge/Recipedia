package com.recipidia.member.request;

import java.io.Serializable;

/**
 * 레시피 즐겨찾기 등록 요청 DTO
 */
public record FavoriteReq(Long userId, Long recipeId, Boolean favorite) implements Serializable { }
