package com.recipidia.recipe.handler;

import com.recipidia.exception.GlobalExceptionResponse;
import com.recipidia.recipe.exception.NoRecipeException;
import com.recipidia.recipe.exception.SummaryNotCookingVideoException;
import com.recipidia.recipe.exception.SummaryNotValidTranscriptException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RecipeExceptionHandler {

  // handle NoRecipeException
  @ExceptionHandler(NoRecipeException.class)
  public ResponseEntity<GlobalExceptionResponse> handleRecipeException(NoRecipeException e) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(GlobalExceptionResponse.builder()
            .httpstatus(HttpStatus.NOT_FOUND.value())
            .errorMsg(e.getMessage())
            .build());
  }

  @ExceptionHandler(SummaryNotValidTranscriptException.class)
  public ResponseEntity<GlobalExceptionResponse> handleInvalidTranscript(SummaryNotValidTranscriptException ex) {
    GlobalExceptionResponse errorResponse = GlobalExceptionResponse.builder()
        .httpstatus(430)
        .errorMsg("Transcript not valid: " + ex.getMessage())
        .build();
    return ResponseEntity.status(430).body(errorResponse);
  }

  @ExceptionHandler(SummaryNotCookingVideoException.class)
  public ResponseEntity<GlobalExceptionResponse> handleNotCookingVideo(SummaryNotCookingVideoException ex) {
    GlobalExceptionResponse errorResponse = GlobalExceptionResponse.builder()
        .httpstatus(432)
        .errorMsg("Not a cooking video: " + ex.getMessage())
        .build();
    return ResponseEntity.status(432).body(errorResponse);
  }
}
