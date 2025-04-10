import groovy.json.JsonSlurper

def check(apiUrl) {
  def maxRetries = 5
  def delaySeconds = 2
  def slurper = new JsonSlurper()

  for (int i = 0; i < maxRetries; i++) {
      try {
          // curl이 실패해도 파이프라인 깨지지 않도록 '|| true' 처리
          def response = sh(script: "curl -s --connect-timeout 2 ${apiUrl}/actuator/health || true", returnStdout: true).trim()

          // response가 비어있으면 아직 서버가 안 뜬 상태
          if (!response) {
              echo "⏳ Spring Boot not responding yet... (${i + 1}/${maxRetries})"
          } else {
              def parsed = slurper.parseText(response)
              if (parsed.status == "UP") {
                  echo "✅ Spring Boot is UP!"
                  break
              } else {
                  echo "⏳ Spring status: ${parsed.status} (${i + 1}/${maxRetries})"
              }
          }
      } catch (Exception e) {
          echo "❌ JSON 파싱 실패 또는 기타 오류: ${e.message}"
      }

      sleep delaySeconds

      if (i == maxRetries - 1) {
          error "Spring Boot가 ${maxRetries * delaySeconds}초 내에 기동되지 않았습니다."
      }
  }
}

return this