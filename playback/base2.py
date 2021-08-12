def binary(integer):
    pass


def ints(x:str): 
    return [*map(int, bytes(x, 'utf-8'))]

def b64(string:str):
    from base64 import b
    
    


if __name__ == '__main__':
    s = 'bobby'
    bi = lambda x: bin(x).replace('b', '')
    print([*map(bi, ints(s))])
    print([*map(len, map(bi, ints(s)))])
    print([*map(binary, ints(s))])
        