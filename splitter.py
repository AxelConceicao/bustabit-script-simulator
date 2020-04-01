import os
import misc
import shutil

class Splitter:
    testfile = None
    tempdirectory = ".temp"
    gamesperfile = None

    def __init__(self, testfile, gamesperfile):
        self.testfile = testfile
        self.gamesperfile = gamesperfile
        self.initDir()

    def delDir(self):
        if not os.path.exists(self.tempdirectory) : return
        shutil.rmtree(self.tempdirectory)

    def initDir(self):
        if os.path.exists(self.tempdirectory) : self.delDir()
        os.makedirs(self.tempdirectory)

    def split(self):
        print("Splitting...")
        data = misc.loadFile(self.testfile)
        i, nb = 0, 1
        file = open(self.tempdirectory + '/' + str(nb) + ".txt", 'w')
        for line in data:
            if i >= self.gamesperfile:
                nb += 1
                file.close()
                file = open(self.tempdirectory + '/' + str(nb) + ".txt", 'w')
                i = 0
            file.write(line)
            i += 1
        file.close()
        print(str(len(data)) + " games splitted into " + str(nb) + ' files')
