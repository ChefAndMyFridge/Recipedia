import os
import json
from openai import OpenAI
from dotenv import load_dotenv

env_path = os.path.join(os.getcwd(), "../config/.env")
load_dotenv(env_path)

class RequestGPT:
    def __init__(self, api_key):
        # config/.env 경로에서 환경 변수 로드
        
        # 환경 변수 사용
        self.client = OpenAI(api_key = api_key)
        self.model = "gpt-4o"

    def run(self, system_input, user_input, stream):
        prompt = []
        for input in system_input:
            prompt.append(input)
        
        for input in user_input:
            prompt.append(input)

        completion = self.client.chat.completions.create(
            model=self.model,
            messages=prompt,
            max_tokens=5000,
            temperature=0.1,
            stream=stream,
        )

        if stream:
            for chunk in completion:
                if chunk.choices[0].delta.content is None:
                    continue
                print(chunk.choices[0].delta.content, end="")
        else:
            ret_message = completion.choices[0].message.content
            json_msg = json.dumps(ret_message)
            # print(ret_message)
            # print("==========================================")
            # print(json_msg)
            print(json.loads(json_msg))


if __name__ == "__main__":
    request_gpt = RequestGPT(os.getenv("OPENAI_API_KEY"))
    system_input = [
        {
            "role" : "system",
            "content" : "너는 식재료만 주어지면 맛있는 음식을 추천해줄 수 있는 백과사전이야."
        }
    ]
    user_input = [
        {
            "role" : "system",
            "content" : "내가 식재료를 주면 너는 그것을 활용해 만들 수 있는 음식만 텍스트로 전달해주면 돼."
        },
        {
            "role" : "system",
            "content" : "최대 5개 제공해주고, 글머리 글번호 등등 결과값 앞에 아무것도 없도록 전달해줘"
        },
        {
            "role" : "user",
            "content" : "답변 예시를 하나 줄게 \n 당근 케이크\n 당근 수프\n 당근 라페\n 당근 주스\n 당근 볶음밥\n"   
        },
        {
            "role" : "user",
            "content" : "치즈를 활용한 레시피 추천해줘"
        }
    ]
    print(request_gpt.run(system_input, user_input))
