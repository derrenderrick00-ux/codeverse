"""Real scikit-learn regression with explicit held-out evaluation (Phase 12).
This tiny synthetic dataset illustrates a method, not credible predictive accuracy.
"""
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error,mean_squared_error


def demonstrate():
    X_train=np.array([[1.0],[2.0],[3.0],[4.0]])
    y_train=np.array([42.,52.,62.,72.])
    X_test=np.array([[5.0],[6.0]])
    y_test=np.array([82.,92.])
    model=LinearRegression().fit(X_train,y_train)
    prediction=model.predict(X_test)
    baseline=np.repeat(float(y_train.mean()),len(y_test))
    return {'slope':float(model.coef_[0]),'intercept':float(model.intercept_),
            'test_mae':float(mean_absolute_error(y_test,prediction)),
            'test_mse':float(mean_squared_error(y_test,prediction)),
            'baseline_mae':float(mean_absolute_error(y_test,baseline)),
            'predictions':prediction.tolist(),
            'note':'Only 6 synthetic observations: illustrative only, not a deployed or validated model.'}


if __name__=='__main__':
    for key,value in demonstrate().items():print(key,value)
