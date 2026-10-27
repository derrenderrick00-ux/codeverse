"""End-to-end command-line Study Intelligence reference (Python stdlib).

Creates a local SQLite database, enforces relational constraints, generates study
analytics, and exports CSV. Does not modify a database unless explicitly run.
"""
from __future__ import annotations
import argparse
import csv
import sqlite3
from pathlib import Path

SCHEMA = '''
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS students (
 id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS sessions (
 id INTEGER PRIMARY KEY, student_id INTEGER NOT NULL REFERENCES students(id),
 subject TEXT NOT NULL, hours REAL NOT NULL CHECK (hours > 0),
 score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100)
);
CREATE INDEX IF NOT EXISTS idx_sessions_student_subject ON sessions(student_id,subject);
'''
STUDENTS = [(1,'Derrick'), (2,'Amina'), (3,'Brian')]
SESSIONS = [(1,1,'Python',2,80),(2,2,'SQL',3,75),(3,1,'Python',4,90),
            (4,3,'SQL',1,60),(5,2,'Pandas',2,85)]


def initialize(connection:sqlite3.Connection)->None:
    connection.executescript(SCHEMA)
    with connection:
        connection.executemany('INSERT OR IGNORE INTO students VALUES(?,?)',STUDENTS)
        connection.executemany('INSERT OR IGNORE INTO sessions VALUES(?,?,?,?,?)',SESSIONS)


def report(connection:sqlite3.Connection)->list[tuple[str,str,float,float,int]]:
    query = '''SELECT s.name, x.subject, ROUND(SUM(x.hours),2) AS hours,
            ROUND(AVG(x.score),2) AS average_score, COUNT(*) AS sessions
            FROM sessions x JOIN students s ON x.student_id=s.id
            GROUP BY s.id,x.subject ORDER BY s.name,x.subject'''
    return list(connection.execute(query))


def export_csv(records:list[tuple[str,str,float,float,int]],destination:Path)->None:
    destination.parent.mkdir(parents=True,exist_ok=True)
    with destination.open('w',newline='',encoding='utf-8') as handle:
        writer=csv.writer(handle)
        writer.writerow(['student','subject','hours','mean_score','sessions'])
        writer.writerows(records)


def run(db_path:Path,csv_path:Path)->int:
    with sqlite3.connect(db_path) as db:
        initialize(db)
        records=report(db)
    export_csv(records,csv_path)
    for row in records:
        print(f'{row[0]:10} | {row[1]:10} | {row[2]:4.1f} hrs | mean {row[3]:5.1f} | {row[4]} sessions')
    print(f'Exported {len(records)} summary rows to {csv_path}')
    return len(records)


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--db',type=Path,default=Path('study_intelligence.db'))
    parser.add_argument('--csv',type=Path,default=Path('study_summary.csv'))
    args=parser.parse_args()
    run(args.db,args.csv)
