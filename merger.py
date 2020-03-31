import misc

class Merger:
    scriptfile = None
    enginefile = 'engine.js'

    def __init__(self, scriptfile):
        self.scriptfile = scriptfile

    def getScript(self):
        data = misc.loadFile(self.scriptfile)
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
            data[i] = data[i].replace("exit", "process.exit")
            data[i] = data[i].replace("log", "console.log")
            # data[i] = data[i].replace("log", "// console.log")
        return data, config

    def merge(self):
        script, config = self.getScript()
        engine = misc.loadFile(self.enginefile)
        temp = engine[:1] + config + engine[:len(engine) - 18]
        temp += script[len(config):] + ["\n"] + engine[len(engine)-19:]
        with open("temp.js", "w") as file:
            for line in temp : file.write(line)