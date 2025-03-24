package com.recipidia.filter.controller;

import com.recipidia.filter.dto.MemberFilterDto;
import com.recipidia.filter.dto.MemberFilterData;
import com.recipidia.filter.request.MemberFilterUpdateReq;
import com.recipidia.filter.service.MemberFilterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/filter")
@RequiredArgsConstructor
public class MemberFilterController {

  private final MemberFilterService memberFilterService;

  @Operation(
      summary = "회원 필터 정보 조회",
      description = "특정 회원의 선호/비선호 정보를 조회합니다.",
      responses = {
          @ApiResponse(responseCode = "200", description = "회원 필터 정보 조회 성공",
              content = @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = MemberFilterDto.class),
                  examples = @ExampleObject(value = """
                    {
                      "memberId": 10,
                      "filterData": {
                        "preferredGenres": ["로맨스", "코미디"],
                        "dislikedGenres": ["공포"],
                        "preferredDietaries": ["채식"],
                        "dislikedDietaries": ["고단백"],
                        "preferredIngredients": ["토마토", "바질"],
                        "dislikedIngredients": ["마늘"]
                      }
                    }
                    """)
              )
          ),
          @ApiResponse(responseCode = "404", description = "회원 정보를 찾을 수 없음")
      }
  )
  @GetMapping("/{memberId}")
  public ResponseEntity<MemberFilterDto> getMemberFilter(@PathVariable Long memberId) {
    MemberFilterDto dto = memberFilterService.getMemberFilter(memberId);
    return ResponseEntity.ok(dto);
  }

  @Operation(
      summary = "회원 필터 정보 업데이트",
      description = "회원이 선택한 선호/비선호 정보를 JSON 형태로 받아 업데이트합니다.",
      requestBody = @RequestBody(
          description = "회원 필터 정보 (예: 선호/비선호하는 장르, 식습관, 재료 정보)",
          required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = MemberFilterData.class),
              examples = @ExampleObject(value = """
                {
                  "preferredGenres": ["로맨스", "코미디"],
                  "dislikedGenres": ["공포"],
                  "preferredDietaries": ["채식"],
                  "dislikedDietaries": ["고단백"],
                  "preferredIngredients": ["토마토", "바질"],
                  "dislikedIngredients": ["마늘"]
                }
                """)
          )
      ),
      responses = {
          @ApiResponse(responseCode = "200", description = "회원 필터 정보 업데이트 성공",
              content = @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = MemberFilterDto.class),
                  examples = @ExampleObject(value = """
                    {
                      "memberId": 10,
                      "filterData": {
                        "preferredGenres": ["로맨스", "코미디"],
                        "dislikedGenres": ["공포"],
                        "preferredDietaries": ["채식"],
                        "dislikedDietaries": ["고단백"],
                        "preferredIngredients": ["토마토", "바질"],
                        "dislikedIngredients": ["마늘"]
                      }
                    }
                    """)
              )
          ),
          @ApiResponse(responseCode = "404", description = "회원 정보를 찾을 수 없음")
      }
  )
  @PutMapping("/{memberId}")
  public ResponseEntity<MemberFilterDto> updateMemberFilter(@PathVariable Long memberId,
                                                            @RequestBody MemberFilterUpdateReq request) {
    /** 제대로 요청 본문이 인식 되도록 수정할 필요가 있습니다.
     *  아무리 고쳐봐도 계속 request가 null 값이 뜨는데, 이 부분에선 아직 딱히 Json 컨버터가 적용되지도 않는데
     *  왜 아무것도 받고 있지 않다고 뜨는 지 이해할 수 가 없습니다.
     *  일단 수정해야하지만 냅두고 다른 우선순위가 높은 작업부터 진행한 뒤
     *  나중에 다시 돌아와서 작업하겠습니다.
      */
    System.out.println(request);
    System.out.println(request.getPreferredGenres());
    // 요청 DTO를 MemberFilterData로 변환
    MemberFilterData filterData = MemberFilterData.builder()
        .preferredGenres(request.getPreferredGenres())
        .dislikedGenres(request.getDislikedGenres())
        .preferredDietaries(request.getPreferredDietaries())
        .dislikedDietaries(request.getDislikedDietaries())
        .preferredIngredients(request.getPreferredIngredients())
        .dislikedIngredients(request.getDislikedIngredients())
        .build();
    System.out.println(filterData);
    MemberFilterDto dto = memberFilterService.updateMemberFilter(memberId, filterData);
    return ResponseEntity.ok(dto);
  }
}
