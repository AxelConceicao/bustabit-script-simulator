import misc
import shutil

class Splitter:
    testfile = None
    tempdirectory = ".temp"

    def __init__(self, testfile):
        self.testfile = testfile
        self.initDirectory()

    def delDir(self):
        if not os.path.exists(tempdirectory) : return
        shutil.rmtree(tempdirectory)

    def initDir(self):
        if os.path.exists(tempdirectory) : self.delDir()
        # os.makedirs(tempdirectory)

    def split(self):
        data = misc.loadFile(self.testfile)
