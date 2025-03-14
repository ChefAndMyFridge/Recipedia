from youtubesearchpython import VideosSearch
from time import time

start_time = time()

# '소불고기 레시피'로 상위 5개의 동영상 검색
videos_search = VideosSearch('소불고기 레시피', limit=5)
results = videos_search.result()

# 각 동영상의 정보 출력
for video in results['result']:
    print(f"Video ID: {video['id']}")
    print(f"Title: {video['title']}")
    print(f"Published Time: {video['publishedTime']}")
    print(f"Duration: {video['duration']}")
    print(f"View Count: {video['viewCount']['text']}")
    print(f"Thumbnail URL: {video['thumbnails'][0]['url']}")
    print(
        f"Description: {' '.join([snippet['text'] for snippet in video.get('descriptionSnippet', [])])}")
    print(f"Channel: {video['channel']['name']}")
    print(f"Channel Link: {video['channel']['link']}")
    print(f"Video Link: {video['link']}")
    print("="*50)

end_time = time()
print(f"Total time: {end_time - start_time:.2f} seconds")
