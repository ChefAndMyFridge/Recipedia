import re

def parse_dish_names(content):
    """불릿 포인트로 구분된 리스트를 파싱하고, '(양식)' 등 괄호 내용을 제거합니다."""
    items = []
    for line in content.split('\n'):
        line = line.strip()
        # 불릿('- ') 제거
        if line.startswith('- '):
            line = line[2:]
        # 괄호 내용 제거
        line = re.sub(r'\(.*?\)', '', line).strip()
        if line:
            items.append(line)
    return items
