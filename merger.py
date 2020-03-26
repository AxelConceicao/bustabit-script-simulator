import sys
import json

def isFileExist(filename):
    try:
        file = open(filename, "r")
        file.close()
    except:
        sys.stderr.write("No such file : " + filename + "\n")
        exit(84)

def loadFile(filename):
    data = []
    file = open(filename, "r")
    for line in file.readlines():
        if line != "":
            data.append(line)
    file.close()
    return data

class Merger:
    scriptName = None
    engineName = 'engine.js'

    def __init__(self, scriptName):
        isFileExist(scriptName)
        self.scriptName = scriptName
        isFileExist(self.engineName)
        self.getScript()

    def getScript(self):
        data = loadFile(self.scriptName)
        config = []
        for i in range(0, len(data)):
            if data[i].replace('\n', '').replace(' ', '') == "varconfig={":
                for j in range(i, len(data)):
                    config.append(data[j])
                    if data[j].replace('\n', '').replace(' ', '') == "};":
                        break
        if not config:
            sys.stderr.write("No config found in script\n")
            exit(84)
        for i in range(0, len(data)):
            data[i] = data[i].replace("log", "console.log")
        return data, config

    def getEngine(self):
        data = loadFile(self.engineName)
        return data

    def merge(self):
        script, config = self.getScript()
        engine = self.getEngine()
        temp = engine[:1] + config + engine[:len(engine) - 11] + script[len(config):] + ["\n"] + engine[len(engine)-12:]
        file = open("temp.js", "w")
        for line in temp:
            file.write(line)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.stderr.write("Invalid arguments\n")
        exit(84)
    merger = Merger(sys.argv[1])
    merger.merge()
    exit(0)