import subprocess

def test_yjs():
    process = subprocess.run(["yarn", "test:js:0"])
    assert process.returncode == 0
