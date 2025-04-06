def checkoutAndGenerateReleaseNotes() {
    // 1. Git checkout
    git branch: env.BRANCH_NAME, credentialsId: 'my-gitlab-token',
        url: 'https://lab.ssafy.com/s12-s-project/S12P21S003.git'

    // 2. Release notes
    def notes = sh(
        script: "git log -n 5 --pretty=format:'%h - %s (by %an, %ad)' --date=format:'%Y-%m-%d %H:%M:%S'",
        returnStdout: true
    ).trim()

    // 3. Latest commit
    def commit = sh(
        script: "git log -1 --pretty=format:'%h - %s (by %an, %ad)' --date=format:'%Y-%m-%d %H:%M:%S'",
        returnStdout: true
    ).trim()

    // 결과를 map으로 리턴
    return [releaseNotes: notes, latestCommit: commit]
}

return this
