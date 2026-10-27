#!/usr/bin/env python3
"""Execute maintainer-authored reference snippets only, never learner-supplied source."""
import json, pathlib, subprocess, sys, tempfile
root = pathlib.Path(__file__).resolve().parents[1]
lessons = json.loads((root/'src/lessons/pythonLessons.json').read_text())
failures=[]
for lesson in lessons:
    if lesson['number']==21: # CLI commands, not a Python source file
        print('SKIP',lesson['id'],'shell environment setup');continue
    with tempfile.TemporaryDirectory(prefix='codeverse-ref-') as temp:
        result=subprocess.run([sys.executable,'-I','-c',lesson['source']],cwd=temp,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,timeout=5)
    expected=lesson['expected'].strip()
    actual=result.stdout.strip()
    if result.returncode!=0 or actual!=expected:
        failures.append((lesson['id'],actual,expected,result.stderr))
        print('FAIL',lesson['id'])
    else:print('PASS',lesson['id'],lesson['title'])
if failures:
    for k,actual,expected,error in failures: print('\n',k,'actual:',repr(actual),'expected:',repr(expected),'stderr:',error)
    raise SystemExit(1)
print(f'PASS {len(lessons)-1}/{len(lessons)-1} Python reference snippets (lesson 21 is Ubuntu shell)')
