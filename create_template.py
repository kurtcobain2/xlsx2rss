from dotenv import load_dotenv
import os


load_dotenv()

ENV_KEYS = ['UPLOAD_FILE_NAME', 'UPLOAD_FILE_URL']

if 'UPLOAD_FILE_NAME' in os.environ:
    print(os.environ['UPLOAD_FILE_NAME'])
if 'UPLOAD_FILE_URL' in os.environ:
    print(os.environ['UPLOAD_FILE_URL'])

def run():
    with open('./templates/request_approve.md', 'r', encoding='utf-8') as f:
        content = f.read()
        
        for key in ENV_KEYS:
            if (key in os.environ):
                content = content.replace(f'$#({key})', os.environ[key])

    with open('./templates/request_approve.tmp.md', 'w', encoding='utf-8') as f:
        f.write(content)

    return

if __name__ == "__main__":
    run()