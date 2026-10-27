import unittest
import sqlite3
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'examples'))
from study_intelligence import initialize,report
from sql_stage import demonstrate

class StudyIntelligenceTest(unittest.TestCase):
    def test_database_report(self):
        with sqlite3.connect(':memory:') as conn:
            initialize(conn)
            results=report(conn)
            self.assertEqual(len(results),4)
            self.assertEqual(sum(x[4] for x in results),5)
            self.assertEqual(conn.execute('PRAGMA foreign_keys').fetchone()[0],1)
    def test_constraint(self):
        with sqlite3.connect(':memory:') as conn:
            initialize(conn)
            with self.assertRaises(sqlite3.IntegrityError):
                conn.execute("INSERT INTO sessions(id,student_id,subject,hours,score) VALUES(9,999,'Bad',1,50)")
    def test_transaction_rollback(self):
        self.assertTrue(demonstrate()['rollback_ok'])
    def test_sql_computed_examples(self):
        sample=demonstrate()
        self.assertEqual(len(sample['filter']),2)
        self.assertEqual(len(sample['group']),3)
    def test_idempotent_seed(self):
        with sqlite3.connect(':memory:') as conn:
            initialize(conn);initialize(conn)
            self.assertEqual(conn.execute('SELECT COUNT(*) FROM sessions').fetchone()[0],5)

if __name__=='__main__':unittest.main()
