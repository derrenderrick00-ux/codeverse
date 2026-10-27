import unittest
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'examples'))
class OptionalScientificTests(unittest.TestCase):
    def test_numpy(self):
        try:from numpy_stage import demonstrate
        except ImportError:self.skipTest('NumPy not installed')
        d=demonstrate()
        self.assertEqual(d['shape'],(2,3))
        self.assertEqual(d['sum'],21.0)
        self.assertEqual(d['product'][0,0],4)
    def test_pandas(self):
        try:from pandas_stage import demonstrate
        except ImportError:self.skipTest('Pandas not installed')
        d=demonstrate();self.assertEqual(len(d['clean']),5);self.assertEqual(len(d['group']),3)
    def test_scikit_learn(self):
        try:from ml_stage import demonstrate
        except ImportError:self.skipTest('scikit-learn/NumPy not installed')
        d=demonstrate();self.assertAlmostEqual(d['slope'],10.0);self.assertLess(d['test_mae'],d['baseline_mae'])

if __name__=='__main__':unittest.main()
