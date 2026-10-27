"""Actual SQLite examples for CODEVERSE SQL Underground (stdlib only)."""
import sqlite3
from study_intelligence import initialize


def demonstrate()->dict[str,object]:
    with sqlite3.connect(':memory:') as db:
        initialize(db)
        above_two=list(db.execute('SELECT subject, hours FROM sessions WHERE hours > ? ORDER BY hours DESC',(2,)))
        grouped=list(db.execute('SELECT subject, SUM(hours) FROM sessions GROUP BY subject ORDER BY subject'))
        ranked=list(db.execute('SELECT subject, hours, ROW_NUMBER() OVER (ORDER BY hours DESC) FROM sessions'))
        joined=list(db.execute('SELECT s.name, x.subject FROM students s LEFT JOIN sessions x ON x.student_id=s.id'))
        before=db.execute('SELECT COUNT(*) FROM sessions').fetchone()[0]
        db.execute('SAVEPOINT trial')
        db.execute('INSERT INTO sessions(id,student_id,subject,hours,score) VALUES(?,?,?,?,?)',(99,1,'Temporary',1,50))
        db.execute('ROLLBACK TO SAVEPOINT trial')
        db.execute('RELEASE SAVEPOINT trial')
        after=db.execute('SELECT COUNT(*) FROM sessions').fetchone()[0]
        return {'filter':above_two,'group':grouped,'rank':ranked,'join':joined,'rollback_ok':before==after}


if __name__=='__main__':
    print(demonstrate())
