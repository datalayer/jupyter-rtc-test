import subprocess

def test_ywasm():
    process = subprocess.run(["yarn", "test:js:2"])
    assert process.returncode == 0
