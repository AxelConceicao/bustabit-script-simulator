import os
import sys

def isFileExist(file):
    if not os.path.isfile(file): 
        sys.stderr.write("No such file : " + file + "\n")
        exit(1)
    return True

def loadFile(filename):
    data = []
    with open(filename, "r") as file:
        for line in file.readlines():
            if line != "" : data.append(line)
    return data

def printUsage():
    print("USAGE\n\tpython3 simulator.py SCRIPT TESTFILE")
    print("\nDESCRIPTION")
    print("\tSCRIPT\t\tscript to test")
    print("\tTESTFILE\tfile containing the games")
    print()