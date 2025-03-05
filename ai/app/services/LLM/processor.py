def parse_bullet_list(content):
    """불릿 포인트로 구분된 리스트를 파싱하는 함수"""
    items = []
    for line in content.split('\n'):
        line = line.strip()
        if line.startswith('- '):
            items.append(line[2:])  # '- ' 제거
    return items
