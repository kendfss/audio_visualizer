"""
Scan the containing directory for audio files and write their Base64 encodings to an "audio.js" file in the upper directory
"""

from base64 import b64encode as encode
import os


import pyperclip as pc, filetype as ft, audio_metadata as am


here, this = os.path.split(__file__)

def code(path):
    with open(path, 'rb') as f:
        content = (encode(f.read())).decode('utf-8')
        pc.copy(content)
        return content

def scrape():
    counter = 0
    with open('../audio.js', 'w') as f:
        f.write('const audios = {')
        for file in os.listdir():
            if os.path.isfile(file) and not file==this:
                if (match := ft.match(file)):
                    if 'audio' in match.MIME:
                        print(file)
                        ext = file.split('.')[-1].lower()
                        try:
                            md = am.load(file).tags
                            title = md['title'][0].replace('(', '_').replace(')', '_').replace(' ', '_').lower()
                        except KeyError:
                            counter += 1
                            title = f"audio{counter}"
                        fstr = f"{title}:\tnew Audio('data:audio/x-{ext};base64,{code(file)}'),"
                        
                        print(fstr[:100])
                        print()
                        f.write(fstr)
        f.write('\n};')


if '__main__' == __name__:
    scrape()
    