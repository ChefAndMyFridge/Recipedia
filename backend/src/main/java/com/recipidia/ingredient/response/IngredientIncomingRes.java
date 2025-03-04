package com.recipidia.ingredient.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

//@Data // Dto도 마찬가지로 최대한 Setter는 지양하고 생성자 주입 활용
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientIncomingRes {
    // 재료 이름 (냉장고 엔티티의 기준)
    private String name;
    // 재료 이미지 URL (신규 생성 시 사용)
//    private String imageUrl;
    private Integer amount;
    // 해당 입고된 재료의 세부 정보
    private String storagePlace;
    private LocalDateTime expirationDate;
    private LocalDateTime incomingDate;
    // 입고 시점에는 보통 null이거나 추후 업데이트
//    private LocalDateTime releasingDate;


}

