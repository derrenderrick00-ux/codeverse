# CODEVERSE: Real Python reference laboratories

The browser visualizer is **bounded**: SQL/Pandas/NumPy panels compute documented JavaScript scenarios rather than evaluating arbitrary Python. These independent reference programs execute real SQLite/Pandas/NumPy/scikit-learn functionality.

## Environment (Ubuntu)

```bash
cd ~/Documents/codeverse
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements-data.txt
```

If your Ubuntu does not have venv support, run `sudo apt install python3-venv`. Do not use `sudo pip` or modify system Python.

## Run stage programs

```bash
python examples/sql_stage.py
python examples/pandas_stage.py
python examples/numpy_stage.py
python examples/ml_stage.py
python examples/study_intelligence.py --db /tmp/codeverse-study.db --csv /tmp/codeverse-study.csv
```

## Check

```bash
python3 -m unittest discover -s tests_python -v
```

The SQLite tests use the standard library. NumPy/Pandas/scikit-learn tests are skipped if optional dependencies are absent, rather than reported as passes.

## Study Intelligence project

The Python reference maintains three student rows and five session rows, enforces primary/foreign key constraints, computes grouped reports and exports them to CSV. The six-row ML example uses synthetic study hours and scores, trains on four observations and evaluates on two held-out rows. It does **not** justify real-world grade predictions.
