from dotenv import load_dotenv
import os
import pandas as pd
from datetime import datetime
from dicttoxml2 import dicttoxml
from xml.dom.minidom import parseString

import utils

load_dotenv(verbose=False, override=False)


FNAME = os.environ['FILE_NAME']
PASS_KEY = os.environ['PASS_KEY']
OUTPUT_PATH = os.environ['OUTPUT_PATH']
OUTPUT_PRENAME = os.environ['OUTPUT_PRENAME']


NOW = datetime.now()
NOW_FORMAT_DATE = NOW.replace(tzinfo=NOW.astimezone().tzinfo).strftime('%a, %d %b %Y %H:%M:%S %z')


# naver rss.xml
df_data = utils.read_protected_excel(FNAME, PASS_KEY)
rss_items, rss_failed = utils.make_rss_items_naver(df_data, NOW_FORMAT_DATE)

RSS_JSON = {
    "rss": {
        "channel": {
            "title": "타이틀",
            "link": "링크",
            "image": {
                "url": "",
                "title": "",
                "link": ""
            },
            "description": "",
            "item": rss_items
        }
    }
}

xml_data = dicttoxml(RSS_JSON, custom_root='root', attr_type=False)
xml_str = parseString(xml_data).toprettyxml()

with open(os.path.join(OUTPUT_PATH, f'{OUTPUT_PRENAME}_naver_rss.xml'), 'w', encoding='utf-8') as f:
    f.write(xml_str)