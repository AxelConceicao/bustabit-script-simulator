import os
import sys
import misc

class Merger:
    enginefile = 'engine.js'
    tempdir = None
    args = []

    def __init__(self, args, tempdir):
        self.args = args
        self.tempdir = tempdir

    def getScript(self):
        data = misc.loadFile(self.args.script)
        config = []
        for i in range(0, len(data)):
            if data[i].replace('\n', '').replace(' ', '') == "varconfig={":
                for j in range(i, len(data)):
                    config.append(data[j])
                    if data[j].replace('\n', '').replace(' ', '') == "};":
                        break
        if not config:
            sys.stderr.write("No config found in script\n")
            exit(1)
        for i in range(0, len(data)):
            if (self.args.logs):
                data[i] = data[i].replace("log", "console.log")
            else:
                data[i] = data[i].replace("log", "// console.log")
        return data, config

    def merge(self):
        print("Merging...")
        script, config = self.getScript()
        engine = misc.loadFile(self.enginefile)
        temp = engine[:1] + config + engine[:len(engine) - 18]
        temp += script[len(config):] + ["\n"] + engine[len(engine)-19:]
        with open(os.getcwd() + "/" + self.tempdir + "/script.js", "w") as file:
            for line in temp : file.write(line)
        print("'" + self.args.script + "' merged")