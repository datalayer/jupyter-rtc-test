from time import sleep

from threading import Thread
 

def task():
    sleep(1)
    print('This is coming from another thread')
 

def test_thread():
    thread = Thread(target=task)
    thread.start()
    print('Waiting for the new thread to finish...')
    thread.join()
