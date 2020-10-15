import os
import sys
import errno

def isFileExist(filename):
    if os.path.isfile(filename):
        return filename
    else:
        raise FileNotFoundError(errno.ENOENT, os.strerror(errno.ENOENT), filename)

def loadFile(filename):
    data = []
    with open(filename, "r") as file:
        for line in file.readlines():
            if line != "" : data.append(line)
    return data