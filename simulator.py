import sys
import misc
import merger
import splitter

class Simulator:
    scriptfile = None
    testfile = None
    gamesperfile = 50000

    def __init__(self, scriptfile, testfile):
        misc.isFileExist(scriptfile); self.scriptfile = scriptfile
        misc.isFileExist(testfile); self.testfile = testfile
        merger.Merger(self.scriptfile, self.gamesperfile).merge()
        splitter.Splitter(self.testfile, self.gamesperfile).split()

if __name__ == "__main__":
    if "-h" in sys.argv:
        misc.printUsage()
        exit(0)
    elif len(sys.argv) < 3:
        misc.printUsage()
        exit(1)
    simulator = Simulator(sys.argv[1], sys.argv[2])
    exit(0)