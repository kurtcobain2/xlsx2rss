from dotenv import load_dotenv
import os
import json


load_dotenv()

ENV_KEYS = [
    'UPLOAD_FILE_NAME', 'UPLOAD_FILE_URL'
    'RESULT_COUNT', 'ARTIFACT_URL'
]

def replaceAllWithEnv():
    with open('./templates/request_approve.md', 'r', encoding='utf-8') as f:
        content = f.read()
        
        for key in ENV_KEYS:
            if (key in os.environ):
                content = content.replace(f'$#({key})', os.environ[key])

    return content

def run():
    # 저장되어있던 json load
    with open(os.path.join(os.environ['TEMP_FOLDER_DATA'], f'''{os.environ['UPLOAD_FILE_NAME']}_naver_rss_successed.json'''), 'r', encoding='utf-8') as f:
        rss_items = json.load(f)
    with open(os.path.join(os.environ['TEMP_FOLDER_DATA'], f'''{os.environ['UPLOAD_FILE_NAME']}_naver_rss_failed.json'''), 'r', encoding='utf-8') as f:
        fail_json = json.load(f)

    os.environ['RESULT_COUNT'] = len(rss_items)
    os.environ['FAILED_COUNT'] = fail_json['cnt']

    # env 모두 대체
    content = replaceAllWithEnv()

    # 저장
    with open('./templates/request_approve.tmp.md', 'w', encoding='utf-8') as f:
        f.write(content)

    return

if __name__ == "__main__":
    run()