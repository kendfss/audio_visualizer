from base64 import b64encode as encode
import os


import pyperclip as pc, filetype as ft, audio_metadata as am


def code(path):
    with open(path, 'rb') as f:
        content = (encode(f.read())).decode('utf-8')
        pc.copy(content)
        return content

def scrape():
    counter = 0
    with open('audio.js', 'w') as f:
        f.write('const audios = [')
        for file in os.listdir():
            if os.path.isfile(file):
                if (match := ft.match(file)):
                    if 'audio' in match.MIME:# and not file.lower().endswith('.wav'):
                        # if (ext := file.split('.')[-1].lower()) != 'wav':
                            # md = am.load(file).tags
                            # title = md['title'][0].replace('(', '_').replace(')', '_').replace(' ', '_').lower()
                            # fstr = f"const {title} = new Audio('data:audio/x-{ext};base64,{code(file)}');"
                            
                        # else:
                            # counter += 1
                            # fstr = f"const audio{counter} = new Audio('data:audio/x-{ext};base64,{code(file)}');"
                        ext = file.split('.')[-1].lower()
                        fstr = f"\n\tnew Audio('data:audio/x-{ext};base64,{code(file)}'),"
                        # print(f'{len(fstr):,}')
                        # print(f'{os.stat(file).st_size:,}')
                        print(file)
                        print(fstr[:100])
                        f.write(fstr)
        f.write('\n];')


if '__main__' == __name__:
    path = './break16-break01.wav'
    path = './Iglooghost - Amu.flac'
    # code(path)
    # print([2**x for x in range(5, 16)])
    scrape()
    