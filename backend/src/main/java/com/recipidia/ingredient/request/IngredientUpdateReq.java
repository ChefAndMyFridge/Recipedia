package com.recipidia.ingredient.request;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

//@Data
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class IngredientUpdateReq {
    private String storagePlace;
    private LocalDateTime expirationDate;
    private LocalDateTime incomingDate;
    private LocalDateTime releasingDate;
}
