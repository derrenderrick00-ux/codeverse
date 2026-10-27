"""Creates explicitly authored domain-specific learning resources. Standard library only."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
DATA={
'sql':'''SELECT|Read selected columns from a table|SELECT name, hours FROM sessions;|Retrieve a learner's study sessions|Projection keeps named columns instead of every field.
WHERE|Filter table rows using a condition|SELECT name, hours FROM sessions WHERE hours > 2;|Find long study sessions|Selection removes rows that do not satisfy the predicate.
GROUP BY|Combine rows into groups before aggregation|SELECT subject, SUM(hours) FROM sessions GROUP BY subject;|Total study time per subject|Each group gets one aggregate row.
HAVING|Filter groups after aggregation|SELECT subject, SUM(hours) FROM sessions GROUP BY subject HAVING SUM(hours) > 3;|Find subjects receiving enough attention|HAVING filters aggregated groups; WHERE filters individual rows.
ORDER BY|Sort query result rows|SELECT name, hours FROM sessions ORDER BY hours DESC;|Show longest sessions first|Descending order places higher values before lower ones.
LIMIT|Restrict returned row count|SELECT name FROM sessions ORDER BY hours DESC LIMIT 2;|List two most intensive sessions|Combine LIMIT with ORDER BY to get the top-ranked rows.
DISTINCT|Remove duplicate selected rows|SELECT DISTINCT subject FROM sessions;|List unique subjects|DISTINCT applies to the entire selected tuple.
JOIN|Combine records through related keys|SELECT s.name, u.name FROM sessions s JOIN users u ON s.user_id = u.id;|Attach student names to sessions|Joining without a correct key can multiply rows.
INNER JOIN|Return rows whose keys match in both tables|SELECT s.name, u.name FROM sessions s INNER JOIN users u ON s.user_id=u.id;|Find owned study sessions|Unmatched rows are excluded.
LEFT JOIN|Keep every left row, even without a right match|SELECT u.name, s.name FROM users u LEFT JOIN sessions s ON u.id=s.user_id;|Find students with no sessions|Unmatched right-side fields are NULL.
RIGHT JOIN|Keep every right row even without left match|SELECT u.name, s.name FROM sessions s RIGHT JOIN users u ON s.user_id=u.id;|Audit all registered users|In SQLite, RIGHT JOIN needs a sufficiently recent version.
FULL JOIN|Include both matched and unmatched rows|SELECT u.name, s.name FROM users u FULL OUTER JOIN sessions s ON u.id=s.user_id;|Detect orphaned or unassigned data|Some databases need a UNION workaround for full joins.
UNION|Combine compatible result sets and remove duplicate rows|SELECT name FROM users UNION SELECT name FROM sessions;|Combine names from two reports|UNION ALL preserves duplicates; UNION removes them.
CASE|Choose an output based on conditions|SELECT name, CASE WHEN hours>=3 THEN 'long' ELSE 'short' END AS label FROM sessions;|Classify study sessions|CASE returns the first matching branch.
COUNT()|Count rows or non-null values|SELECT COUNT(*) FROM sessions;|Count recorded sessions|COUNT(*) counts rows; COUNT(column) excludes NULL.
SUM()|Compute a numeric total|SELECT SUM(hours) FROM sessions;|Calculate study hours|SUM ignores NULL values.
AVG()|Calculate the arithmetic mean|SELECT AVG(hours) FROM sessions;|Mean duration of study|Use an explicit grouping when averaging per subject.
MIN() / MAX()|Find the smallest and largest values|SELECT MIN(hours), MAX(hours) FROM sessions;|Identify shortest and longest sessions|Aggregates return summary values.
CTE (WITH)|Name a temporary query result for one statement|WITH totals AS (SELECT subject, SUM(hours) h FROM sessions GROUP BY subject) SELECT * FROM totals;|Organize complex summaries|A CTE makes multistage queries more readable.
WINDOW|Calculate across related rows without collapsing them|SELECT name, hours, ROW_NUMBER() OVER (ORDER BY hours DESC) AS rank FROM sessions;|Rank sessions while retaining rows|Window functions preserve individual records.
INDEX|Build an auxiliary lookup structure|CREATE INDEX idx_subject ON sessions(subject);|Speed searches by subject|Indexes have space and write-time costs.
VIEW|Save a reusable query definition|CREATE VIEW long_sessions AS SELECT * FROM sessions WHERE hours>2;|Expose a filtered reporting view|A normal view stores the query, not duplicate table rows.
SUBQUERY|Nest one query inside another|SELECT name FROM sessions WHERE hours > (SELECT AVG(hours) FROM sessions);|Find above-average sessions|The inner query provides a value or relation to the outer query.
TRANSACTION|Group modifications as one atomic unit|BEGIN; UPDATE sessions SET hours=4 WHERE id=1; COMMIT;|Safely update records|ROLLBACK cancels uncommitted changes.''',
'pandas':'''Read Data|Load CSV records into a DataFrame|df = pd.read_csv('sessions.csv')|Import learning logs|File encoding and missing values may affect import.
View Data|Inspect the first few rows|df.head()|Preview recently imported records|head() defaults to five rows.
Info|Inspect column types and null counts|df.info()|Check imported data quality|info() shows non-null counts and types.
Summary|Calculate descriptive statistics|df.describe()|Summarize completion rates|describe() defaults to numeric columns.
Shape|Get row and column counts|df.shape|Inspect dataset dimensions|The first dimension counts rows.
Columns|Read column labels|df.columns|Confirm schema after import|Column names must match when selecting.
Data Types|Inspect per-column dtypes|df.dtypes|Identify numbers imported as strings|Pandas nullable types differ from base Python types.
Select Column|Extract one named Series|df['hours']|Analyze study durations|Single brackets normally return a Series.
Select Multiple|Extract several columns|df[['name', 'hours']]|Prepare a slim report|Double brackets return a DataFrame.
Filter Rows|Keep rows meeting a condition|df[df['hours'] > 2]|Find longer sessions|A Boolean mask is evaluated for each row.
Sort Values|Order rows by column|df.sort_values('hours', ascending=False)|Rank sessions|Sorting returns a new DataFrame unless assigned.
Group By|Partition records by categorical values|df.groupby('subject')['hours'].sum()|Report hours by subject|Grouping alone does not aggregate until a reduction is used.
Aggregation|Compute several statistics per group|df.groupby('subject')['hours'].agg(['sum','mean'])|Compare total and average effort|Aggregation reduces rows into summary values.
Merge|Join records from different DataFrames|pd.merge(sessions, students, on='student_id', how='inner')|Combine student details with logs|Duplicate keys can produce multiple rows.
Concat|Append compatible DataFrames|pd.concat([january, february], ignore_index=True)|Combine monthly logs|Concatenation does not join on a key.
Drop|Remove selected columns or records|df.drop(columns=['obsolete'])|Remove unused fields|drop() does not mutate the original by default.
Rename|Change column labels|df.rename(columns={'hrs':'hours'})|Standardize incoming CSV schema|Renaming does not change stored data values.
Handle Missing|Fill or remove missing cells|df['hours'].fillna(df['hours'].median())|Repair incomplete study logs|Imputation decisions can bias subsequent models.
Apply Function|Apply a function to series values|df['hours'].apply(lambda x: x*60)|Convert study hours to minutes|Prefer vectorized operations where available.
Value Counts|Count occurrences of each category|df['subject'].value_counts()|Find the most common subject|Missing values are omitted by default.
Pivot Table|Summarize values across two dimensions|df.pivot_table(values='hours',index='student',columns='subject',aggfunc='sum')|Compare students across subjects|Pivot tables aggregate repeated combinations.
Date/Time|Convert text to datetime|pd.to_datetime(df['date'])|Create weekly reports|Invalid date formats need explicit handling.
String Methods|Process text within a Series|df['subject'].str.lower()|Standardize subject spellings|The .str accessor operates elementwise.
Unique Values|List distinct values|df['subject'].unique()|Inspect subject categories|unique() returns encountered categories in order.
Boolean Masking|Combine conditions for filtering|df[(df['hours']>2) & (df['score']>=70)]|Find long high-scoring sessions|Use parentheses around each condition with & or OR.''',
'numpy':'''Array|Create a typed n-dimensional array|np.array([1, 2, 3])|Store numerical study data|Arrays normally hold a uniform dtype.
Zeros|Create an array filled with zero|np.zeros((2, 3))|Initialize numeric buffers|The tuple specifies rows and columns.
Ones|Create a constant-one array|np.ones((2, 3))|Create a baseline mask|dtype can be specified explicitly.
Arange|Generate a half-open numeric sequence|np.arange(0, 10, 2)|Generate regular time ticks|The stop value is excluded.
Linspace|Generate evenly spaced values|np.linspace(0, 1, 5)|Sample a smooth parameter range|The endpoint is included by default.
Random|Generate sampled numbers|np.random.default_rng(42).random((2, 3))|Build synthetic experimental data|A seed improves reproducibility.
Shape|Read the size of each axis|arr.shape|Inspect a batch of features|Shape describes each dimension, not total count alone.
Reshape|Reinterpret elements with a new compatible shape|arr.reshape(3, 2)|Convert a flat log into a matrix|The element count must remain the same.
Dimension|Read number of axes|arr.ndim|Distinguish vectors from matrices|A vector typically has ndim=1.
Data type|Inspect element storage type|arr.dtype|Ensure numeric calculations use appropriate precision|Changing dtype may affect memory and rounding.
Indexing|Access a specific element by position|arr[0, 1]|Read one feature at a given row and column|Indexes start at zero.
Slicing|Extract a region of an array|arr[1:4]|Select a time interval|Slices usually exclude the stop position.
Boolean Masking|Select elements matching a condition|arr[arr > 0]|Remove negative samples|The Boolean mask must align with the data.
Broadcasting|Combine compatible shapes elementwise|arr + 5|Normalize multiple records in one operation|Dimensions align from the trailing axes.
Sum|Reduce array elements by addition|np.sum(arr)|Calculate total study hours|Choose axis to summarize rows or columns.
Mean|Calculate arithmetic average|np.mean(arr)|Average results for one learner|An empty array yields undefined mean.
Std Dev|Measure variation around the mean|np.std(arr)|Quantify consistency of study sessions|NumPy defaults to population standard deviation.
Min / Max|Find smallest and largest array values|np.min(arr), np.max(arr)|Track extremes in quiz results|An empty array needs special handling.
Argmax/Argmin|Return positions of extreme elements|np.argmax(arr), np.argmin(arr)|Locate best/worst assessment|Flattening is the default without axis.
Concatenate|Join compatible arrays along an axis|np.concatenate((a, b))|Combine numeric batches|Shapes must match along other axes.
Split|Divide an array into subarrays|np.split(arr, 3)|Create equal batches|Equal splitting requires a divisible axis length.
Stack|Combine arrays on a new axis|np.stack((a, b))|Build feature channels|Inputs must have matching shapes.
Identity Matrix|Create a matrix with ones on the diagonal|np.eye(3)|Build identity transformations|The identity leaves compatible vectors unchanged when multiplied.
Matrix Operations|Perform matrix multiplication|A @ B|Combine features and learned weights|Matrix multiplication differs from elementwise *.''',
'ml':'''Problem Framing|Turn a question into a measurable prediction task|Predict next-week study score from study hours|Study planning|Choose target, features, baseline and success metric before training.
Datasets & Features|Separate observations into inputs and labels|X = [[1], [2], [3]]; y = [45, 55, 65]|Prepare training data|Features must be available at prediction time.
Train / Validation / Test|Separate learning, tuning and final evaluation data|Train 70%; validate 15%; test 15%|Avoid evaluating on memorized records|Fit preprocessing using training data only.
Data Leakage|Prevent information from the future entering training|Never include final exam score as an input when predicting it|Security and forecasting|Leakage produces misleadingly optimistic accuracy.
Supervised Learning|Learn mappings from labeled examples|Model study hours against exam score|Grade prediction|Regression predicts numbers; classification predicts classes.
Regression|Predict a continuous numeric target|prediction = weight * hours + bias|Forecast expected assessment result|A line can capture simple linear trends, not every relationship.
Classification|Assign observations to discrete labels|Predict pass or needs-support|Route intervention recommendations|Choose metrics beyond accuracy for imbalanced classes.
k-Nearest Neighbors|Predict based on nearby labeled samples|Compare a new student with the closest known study records|Recommendation prototypes|Scaling affects distance-based methods.
Linear Regression & Gradient Descent|Optimize slope and intercept by reducing squared error|w = w - rate * gradient|Train a transparent baseline model|Gradient descent can diverge when the learning rate is too large.
Model Metrics|Measure generalization error using held-out data|MAE = mean(abs(actual - predicted))|Audit model quality|Measure performance against a naive baseline.
Overfitting & Regularization|Balance training fit against unseen-data performance|Reduce complexity if training error is low and validation error is high|Robust prediction systems|More parameters can memorize noise instead of patterns.
Decision Trees|Split feature space using learned rules|IF hours>=3 THEN likely pass|Explainable recommendation rules|Deep trees can overfit.
Feature Scaling|Normalize features into comparable ranges|z = (x - mean) / std|Distance-based models|Fit scaling parameters only on training records.
Cross-validation|Rotate held-out folds to estimate stability|5-fold cross-validation|Small-data evaluation|Use time-aware splits for chronological records.
Neural Network Basics|Compose weighted transformations and nonlinearities|output = activation(weight * input + bias)|Explore nonlinear models|Neural networks need careful training and validation.
Deployment & Monitoring|Serve a versioned model and monitor drift|POST /predict with a schema-validated request|Study Intelligence prediction API|Production predictions need latency, data-quality and drift monitoring.'''
}
for domain,block in DATA.items():
    lessons=[]
    for number,line in enumerate(block.strip().splitlines(),1):
        title,definition,example,use,insight=line.split('|')
        prefix={'sql':'sql','pandas':'pd','numpy':'np','ml':'ml'}[domain]
        expected={'sql':'Inspect the returned table, including row count and column names.','pandas':'Inspect the transformed DataFrame or Series.','numpy':'Inspect the resulting shape, values, and dtype.','ml':'Compare model outputs with the baseline and evaluation metric.'}[domain]
        wrong=[f'The operation always modifies the input permanently.',f'The operation ignores input shape, types and constraints.',f'The operation is valid without checking its assumptions.']
        quiz_options=[definition,wrong[0],wrong[1],wrong[2]]
        idx=(number*3)%4
        correct=quiz_options.pop(0);quiz_options.insert(idx,correct)
        repair_options=['Verify assumptions and inspect the result.', 'Skip validation and trust the animation.', 'Treat the output as proof of a production-ready model.', 'Silently accept any unsupported code.']
        ridx=(number+1)%4;repair_options.remove(repair_options[0]);repair_options.insert(ridx,'Verify assumptions and inspect the result.')
        lessons.append(dict(id=f'{prefix}-{number:02}',number=number,world=domain,title=title,minutes=20,
          objectives=[f'Define {title.lower()} and identify its input and output.',f'Predict how {title.lower()} changes a real study dataset.',f'Explain limitations and validate the result independently.'],
          definitions=[{'term':title,'meaning':definition},{'term':'Key insight','meaning':insight}],
          explanation=[definition,insight,f'Worked example: {example}',f'Application: {use}. Always inspect data types, missing values, and assumptions.'],
          diagram=f'Input → {title} → observed result and validation',source=example,expected=expected,
          applications=[use,f'Add a {title.lower()} operation to Study Intelligence and explain what could go wrong.'],
          quiz=dict(question=f'Which statement correctly describes {title}?',options=quiz_options,answer=idx,explanation=definition),
          repair=dict(source=example,options=repair_options,answer=ridx,explanation=insight),
          build=f'Use {title.lower()} on a small dataset, then state the input, result and validation check.',
          miniProject=f'Create a focused {title.lower()} demonstration using Study Intelligence data. Record assumptions and an example result.',
          mainProject=f'Extend Study Intelligence with {title.lower()}; preserve a reproducible before/after dataset.',supportedInTracer=False))
    out=ROOT/'src'/'worlds'/('machine-learning' if domain=='ml' else domain)/'lessons.json'
    out.write_text(json.dumps(lessons,indent=2,ensure_ascii=False)+'\n')
    print(domain,len(lessons))
