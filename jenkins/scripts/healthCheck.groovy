def check(apiUrl, username, password) {
  // 1. 로그인 요청 → 토큰 추출
  def response = sh(
      script: """
          docker exec my-nginx sh -c '
            curl -s -w "\\n%{http_code}" \\
            -X POST ${apiUrl}/v1/auth/login \\
            -H "Content-Type: application/json" \\
            -d "{\\"username\\": \\"${USERNAME}\\", \\"password\\": \\"${PASSWORD}\\"}"
          '
      """,
      returnStdout: true
  ).trim()

  def lines = response.readLines()
  if (lines.size() < 2) {
    def statusOnly = lines.size() == 1 ? lines[0] : 'unknown'
    error("❌ 로그인 실패 또는 응답 이상 (status=${statusOnly})")
  }

  def jwt = lines[0]
  def status = lines[1]

  if (status != '200') {
    error("❌ 로그인 실패 또는 토큰 이상 (status=${status})")
  }

  // 2. 인증이 필요한 API 호출
  def resCode = sh(
      script: """
          docker exec my-nginx curl -s -o /dev/null -w '%{http_code}' \\
          -H "Authorization: Bearer ${jwt}" \\
          ${apiUrl}/v1/ingredient
      """,
      returnStdout: true
  ).trim()

  if (resCode == '200') {
    echo '✅ 인증된 API 호출 성공!'
  } else {
    error("❌ 인증 API 호출 실패 (응답코드: ${resCode})")
  }
}

return this
