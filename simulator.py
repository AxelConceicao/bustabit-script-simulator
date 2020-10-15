import misc
import merger
import cleaner
import argparse
import subprocess

class Simulator:
    tempdir = ".temp"
    args = []

    def __init__(self, args):
        self.args = args
        cleaner.Cleaner(self.args, self.tempdir).clean()
        merger.Merger(self.args, self.tempdir).merge()

    def start(self):
        print("Starting...")
        subprocess.run(["node", self.tempdir + "/" + "script.js", self.tempdir + "/test.txt", str(self.args.balance), str(self.args.crashes).lower()])

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("script", help="script to test", type=misc.isFileExist)
    parser.add_argument("testfile", help="file with games", type=misc.isFileExist)
    parser.add_argument("-l", "--logs", help="view script logs", action='store_true')
    parser.add_argument("-c", "--crashes", help="display 25 biggest crashes", action='store_true')
    parser.add_argument("-b", "--balance", help="starting balance", type=int, default=1000000000)
    Simulator(parser.parse_args()).start()
    exit(0)