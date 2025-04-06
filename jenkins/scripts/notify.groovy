def sendMattermostNotification(String status, String releaseNotes = "- No release notes.", String commit = "Unknown", String duration = "측정 불가") {
    def emoji
    def color
    switch (status) {
        case 'STARTED':
            emoji = "🚀"
            break
        case 'SUCCESS':
            emoji = "✅"
            break
        case 'FAILURE':
            emoji = "❌"
            break
        default:
            emoji = "ℹ️"
    }

    def buildUrl = "${env.BUILD_URL}console"
    def timestamp = new Date().format("yyyy-MM-dd HH:mm", TimeZone.getTimeZone('Asia/Seoul'))

    def message = """
## **[${env.BRANCH_NAME}]** 브랜치 - **${env.JOB_NAME}** 빌드 **${status}** ${emoji} (*#${env.BUILD_NUMBER}*)
🔀 트리거 커밋 : **${commit}**
🕒 현재 시각 : **${timestamp}**
⏱️ 빌드 시간 : **${duration}**
🔗 [콘솔 보기](${buildUrl})  
    """.stripIndent().trim()

    def escapedReleaseNotes = escapeJson(releaseNotes)
    def gitGraph = "```\\n${escapedReleaseNotes}\\n```"

    sh """
    curl -X POST -H 'Content-Type: application/json' \\
    -d '{
        "text": "${message}",
        "attachments": [
            {
                "pretext": "### Release Notes📋",
                "text" : "${gitGraph}"
            }
            ]
    }' ${env.MATTERMOST_WEBHOOK_URL}
    """
}

def escapeJson(String s) {
    return s
        .replace("\\", "\\\\")   // 백슬래시 먼저!
        .replace("\"", "\\\"")   // 큰따옴표 이스케이프
        .replace("\r", "")       // 캐리지 리턴 제거
        .replace("\n", "\\n")    // 줄바꿈 이스케이프
}

return this