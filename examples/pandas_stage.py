"""Real Pandas DataFrame transformations for Stage 3 / Phase 10.
Install optional dependencies from requirements-data.txt inside a virtualenv.
"""
import pandas as pd


def demonstrate():
    df=pd.DataFrame({'student':['Derrick','Amina','Derrick','Brian','Amina'],
                     'subject':['Python','SQL','Python','SQL','Pandas'],
                     'hours':[2,3,4,1,2], 'score':[80,75,90,60,None],
                     'date':['2026-10-01','2026-10-02','2026-10-03','2026-10-04','2026-10-05']})
    df['date']=pd.to_datetime(df['date'],errors='raise')
    df['score']=df['score'].fillna(df['score'].median())
    totals=df.groupby('subject',as_index=False).agg(total_hours=('hours','sum'),mean_score=('score','mean'))
    filtered=df.loc[(df['hours']>2)&(df['score']>=70),['student','subject','hours','score']]
    pivot=df.pivot_table(values='hours',index='student',columns='subject',aggfunc='sum',fill_value=0)
    return {'clean':df,'group':totals,'filter':filtered,'pivot':pivot}


if __name__=='__main__':
    for key,result in demonstrate().items():print(f'\n[{key}]\n{result.to_string(index=True)}')
