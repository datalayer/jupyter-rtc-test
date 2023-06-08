import subprocess

def test_yrs():
    process = subprocess.run(["yarn", "test:js:1"])
    assert process.returncode == 0
