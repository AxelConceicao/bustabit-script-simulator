import sys
import misc
import merger

class Simulator:
    scriptfile = None
    testfile = None

    def __init__(self, scriptfile, testfile):
        misc.isFileExist(scriptfile); self.scriptfile = scriptfile
        misc.isFileExist(testfile); self.testfile = testfile
        merger.Merger(scriptfile).merge()

if __name__ == "__main__":
    if "-h" in sys.argv:
        misc.printUsage()
        exit(0)
    elif len(sys.argv) != 3:
        misc.printUsage()
        exit(1)
    simulator = Simulator(sys.argv[1], sys.argv[2])
    exit(0)