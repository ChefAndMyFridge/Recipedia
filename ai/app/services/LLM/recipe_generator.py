# app/services/LLM/recipe_generator.py
import os
import json
import asyncio
import re
import openai
from app.core.config import settings
from app.models.prompt_input import UserInput, SystemInput


class RequestGPT:
    def __init__(self, api_key: str):
        self.client = openai.AsyncOpenAI(api_key=api_key)

    def extract_json(self, markdown_output: str) -> dict:
        """ Json Markdown 형태를 추출하여 Dictionary 형태로 변환합니다.

        Args:
            markdown_output(str): Markdown으로 묶여진 String 레시피 데이터

        Returns:
            dict: Markdown이 추출된 Dictionary 레시피 데이터
        """
        # 만약 문자열이 큰따옴표로 감싸져 있다면 unescape 처리합니다.
        if markdown_output.startswith('"') and markdown_output.endswith('"'):
            markdown_output = json.loads(markdown_output)

        # ```json 코드 블록 내부의 JSON 부분 추출
        match = re.search(
            r'```json\s*(\{.*\})\s*```', markdown_output, re.DOTALL)
        if match:
            json_str = match.group(1)
            json_data = json.loads(json_str)
            # 리턴 타입 검사
            assert isinstance(
                json_data, dict), f"Excepted return type of extract_json is dict, but got {type(json_data)}"
            return json_data
        else:
            # 리턴 타입 검사
            json_markdown_output = json.loads(markdown_output)
            assert isinstance(
                json_markdown_output, dict), f"Excepted return type of extract_json is dict, but got {type(json_markdown_output)}"
            return json_markdown_output

    async def run(self, system_input: SystemInput, user_input: UserInput) -> dict:
        """ 시스템 입력과 사용자 입력을 받아 OpenAI API를 호출합니다.
        stream이 True이면 스트리밍으로 결과를 출력하고, 그렇지 않으면 전체 응답을 반환합니다.

        Args:
            system_input(SystemInput): 프롬프트의 시스템 입력
            user_input(UserInput): 프롬프트의 유저 입력
        Retruns:
            dict: 레시피 요약 Dictionary 데이터
        """
        prompt = []
        for input in system_input:
            prompt.append(input)

        for input in user_input:
            prompt.append(input)

        completion = await self.client.chat.completions.create(
            model=settings.SUMMARY_OPENAI_MODEL,
            messages=prompt,
            max_tokens=settings.SUMMARY_OPENAI_MAX_TOKENS,
            temperature=settings.SUMMARY_OPENAI_TEMPERATURE,
            top_p=settings.SUMMARY_OPENAI_TOP_P,
            frequency_penalty=settings.SUMMARY_OPENAI_FREQUENCY_PENALTY,
            stream=settings.SUMMARY_OPENAI_STREAM,
        )

        if settings.SUMMARY_OPENAI_STREAM:
            result = ""
            async for chunk in completion:
                delta_content = chunk.choices[0].delta.get("content")
                if delta_content is None:
                    continue
                result += delta_content
                print(delta_content, end="")
        else:
            ret_message = completion.choices[0].message.content
            data = self.extract_json(ret_message)
            if type(data) is str:
                data = json.loads(data)

            # 리턴 타입 검사
            assert isinstance(
                data, dict), f"Excepted return type of RequestGPT.run is dict, but got {type(data)}"
            return data


if __name__ == "__main__":
    async def main():
        api_key = settings.OPENAI_API_KEY
        if not api_key:
            raise Exception("OPENAI_API_KEY가 설정되지 않았습니다.")
        request_gpt = RequestGPT(api_key)

        system_input = [
            {
                "role": "system",
                "content": "너는 식재료만 주어지면 맛있는 음식을 추천해줄 수 있는 백과사전이야."
            }
        ]
        user_input = [
            {
                "role": "system",
                "content": "내가 식재료를 주면 너는 그것을 활용해 만들 수 있는 음식만 텍스트로 전달해주면 돼."
            },
            {
                "role": "system",
                "content": "최대 5개 제공해주고, 글머리 글번호 등 결과값 앞에 아무것도 없도록 전달해줘"
            },
            {
                "role": "user",
                "content": "답변 예시를 하나 줄게 \n 당근 케이크\n 당근 수프\n 당근 라페\n 당근 주스\n 당근 볶음밥\n"
            },
            {
                "role": "user",
                "content": "치즈를 활용한 레시피 추천해줘"
            }
        ]

        result = await request_gpt.run(system_input, user_input)
        print("\n\n요약 결과:")
        print(result)

    asyncio.run(main())
