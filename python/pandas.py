import pandas as pd
import numpy as np

def random():
    df = pd.DataFrame(np.random.randint(0,100,size=(15, 4)), columns=list('ABCD'))
    return df.to_html()