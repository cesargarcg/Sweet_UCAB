from email import message
import random
from tkinter import Text


for i in range(13):
    mes = str(random.randint(1,12))
    if mes==2:
        dia = str(random.randint(1,28))
    elif mes==1 or mes==3 or mes==5 or mes==7 or mes==8 or mes==10 or mes==12 :
        dia = str(random.randint(1,31))
    else:
        dia = str(random.randint(1,30))

    hora = str(random.randint(0,24))
    minuto = str(random.randint(0,59))
    segundo = str(random.randint(0,59))
    milisegundo = str(random.randint(0,999))


    text = "2022-"+dia+"-"+mes+" "+hora+":"+minuto+":"+segundo+"."+milisegundo
    print(text)