"""Real NumPy operations for Stage 4 / Phase 11."""
import numpy as np


def demonstrate():
    data=np.array([1,2,3,4,5,6],dtype=float)
    matrix=data.reshape(2,3)
    broadcast=matrix+5
    mask=matrix[matrix>3]
    left=np.array([[1,2],[3,4]])
    right=np.array([[2,0],[1,2]])
    product=left@right
    return {'shape':matrix.shape,'sum':float(np.sum(data)),
            'mean':float(np.mean(data)),'population_std':float(np.std(data)),
            'broadcast':broadcast,'masked':mask,'product':product,
            'identity':np.eye(3),'grid':np.linspace(0,1,5)}


if __name__=='__main__':
    for key,value in demonstrate().items():print(f'{key}: {value}')
