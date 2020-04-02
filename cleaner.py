import os
import misc
import shutil

class Cleaner:
    testfile = None
    tempdir = None
    games = 0

    def __init__(self, testfile, tempdir):
        self.testfile = testfile
        self.tempdir = tempdir
        self.initDir()

    def delDir(self):
        if not os.path.exists(self.tempdir) : return
        shutil.rmtree(self.tempdir)

    def initDir(self):
        if os.path.exists(self.tempdir) : self.delDir()
        os.makedirs(self.tempdir)

    def invalidline(self, line):
        if line[0] == '#' : return True
        temp = line.split(':')
        if len(temp) != 3 : return True
        try:
            float(temp[2])
        except:
            return True
        return False

    def clean(self):
        print("Cleaning...")
        data = misc.loadFile(self.testfile)
        file = open(self.tempdir + '/' + "test.txt", 'w')
        err = 0
        for line in data:
            if not self.invalidline(line):
                file.write(line)
            else:
                err += 1
        file.close()
        self.games = len(data) - err
        print("'" + self.testfile + "' cleaned (" + str(self.games) 
        + " games and " + str(err) + " invalid lines)")
