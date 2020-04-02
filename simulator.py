import os.path
import sys
import misc
import merger
import cleaner
import subprocess

class Simulator:
    scriptfile = None
    testfile = None
    tempdir = ".temp"
    options = []

    def __init__(self, scriptfile, testfile, options):
        self.options = options
        misc.isFileExist(scriptfile); self.scriptfile = scriptfile
        misc.isFileExist(testfile); self.testfile = testfile
        cleaner.Cleaner(self.testfile, self.tempdir).clean()
        merger.Merger(self.scriptfile, self.tempdir, self.options).merge()

    def start(self):
        print("Starting...")
        subprocess.run(["node", self.tempdir + "/" + "script.js", self.tempdir + "/test.txt"])

if __name__ == "__main__":
    if "-h" in sys.argv:
        misc.printUsage()
        exit(0)
    elif len(sys.argv) < 3:
        misc.printUsage()
        exit(1)
    options = []
    for av in sys.argv:
        if av.lower() == '-l':
            options.append(['-l', 0])
    Simulator(sys.argv[1], sys.argv[2], options).start()
    exit(0)